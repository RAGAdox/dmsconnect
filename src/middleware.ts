import FEATURE_FLAGS from "@/config/featureFlags";
import isAllowedEmailDomain from "@/services/isAllowedEmailDomain";
import hasRequiredRoles from "@/utils/hasReuiredRoles";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isAPI = createRouteMatcher(["/api(.*)"]);

const isProtectedRoute = createRouteMatcher([
  "/files(.*)",
  "/file-upload(.*)",
  "/onboarding(.*)",
  "/banned(.*)",
]);
const isPublicApi = createRouteMatcher([]);

const isOnboardingApi = createRouteMatcher(["/api/onboard"]);

const isMatchedByRoute = (route: string | string[], req: NextRequest) => {
  if (Array.isArray(route)) {
    return createRouteMatcher(route)(req);
  }
  return createRouteMatcher([route])(req);
};

const handleApiAuthentication = (
  sessionClaims: CustomJwtSessionClaims | null,
  req: NextRequest
) => {
  if (!sessionClaims) {
    console.error(`${req.nextUrl.pathname}`, "Unauthorized");
    return NextResponse.json({ message: "Unauthoried" }, { status: 401 });
  }
};

const handleApiAuthorization = (
  sessionClaims: CustomJwtSessionClaims | null,
  req: NextRequest
) => {
  if (
    sessionClaims &&
    FEATURE_FLAGS.onboarding.enabled &&
    !sessionClaims.publicMetadata?.onboardingComplete &&
    !isOnboardingApi(req)
  ) {
    console.error(`${req.nextUrl.pathname}`, "Access Denied");
    return NextResponse.json({ message: "Access Denied" }, { status: 403 });
  }

  /* IMPLEMENT FEATURE FLAG ACCESS LEVEL AUTHORIZATION */
};

const handleApiProtection = (
  sessionClaims: CustomJwtSessionClaims | null,
  req: NextRequest
) => {
  if (isAPI(req) && !isPublicApi(req)) {
    return (
      handleApiAuthentication(sessionClaims, req) ||
      handleApiAuthorization(sessionClaims, req)
    );
  }
};

const handleRouteAuthentication = (
  sessionClaims: CustomJwtSessionClaims | null,
  req: NextRequest
) => {
  if (isProtectedRoute(req) && !sessionClaims) {
    console.error(
      req.nextUrl.pathname,
      "authentication redirect->",
      `${req.nextUrl.origin}?promptLogin=true`
    );
    return NextResponse.redirect(`${req.nextUrl.origin}?promptLogin=true`);
  }
};

const handleCheckEmailDomain = (
  sessionClaims: CustomJwtSessionClaims | null,
  req: NextRequest
) => {
  const featureUrl = `${req.nextUrl.origin}${FEATURE_FLAGS.check_email_domains.featureUrl}`;
  const fallbackUrl = `${req.nextUrl.origin}${FEATURE_FLAGS.check_email_domains.fallbackUrl}`;
  if (
    FEATURE_FLAGS.check_email_domains.enabled &&
    sessionClaims &&
    !isAllowedEmailDomain(sessionClaims.email)
  ) {
    if (!isMatchedByRoute(FEATURE_FLAGS.check_email_domains.featureUrl, req)) {
      console.error(req.nextUrl.pathname, "Bad email redirect->", featureUrl);
      return NextResponse.redirect(featureUrl);
    } else {
      return NextResponse.next(); // Early Exit
    }
  }

  if (
    sessionClaims &&
    isAllowedEmailDomain(sessionClaims.email) &&
    isMatchedByRoute(FEATURE_FLAGS.check_email_domains.featureUrl, req)
  ) {
    console.error(req.nextUrl.pathname, "Not Banned->", fallbackUrl);
    return NextResponse.redirect(fallbackUrl);
  }
};

const handleCheckOnboarding = (
  sessionClaims: CustomJwtSessionClaims | null,
  req: NextRequest
) => {
  const featureUrl = `${req.nextUrl.origin}${FEATURE_FLAGS.onboarding.featureUrl}`;
  const fallbackUrl = `${req.nextUrl.origin}${FEATURE_FLAGS.onboarding.fallbackUrl}`;
  if (
    FEATURE_FLAGS.onboarding.enabled &&
    sessionClaims &&
    !(sessionClaims.publicMetadata?.onboardingComplete || false)
  ) {
    if (!isMatchedByRoute(FEATURE_FLAGS.onboarding.featureUrl, req)) {
      console.error(req.nextUrl.pathname, "onboarding redirect->", featureUrl);
      return NextResponse.redirect(featureUrl);
    } else {
      return NextResponse.next(); // Early Exit
    }
  }

  if (
    sessionClaims &&
    sessionClaims.publicMetadata?.onboardingComplete &&
    isMatchedByRoute(FEATURE_FLAGS.onboarding.featureUrl, req)
  ) {
    console.error(req.nextUrl.pathname, "onboarding redirect->", fallbackUrl);
    return NextResponse.redirect(fallbackUrl);
  }
};

const handleModuleFeatureFlag = (
  sessionClaims: CustomJwtSessionClaims | null,
  req: NextRequest
) => {
  const currentModule = Object.keys(FEATURE_FLAGS)
    .map((key) => FEATURE_FLAGS[key as keyof typeof FEATURE_FLAGS])
    .find(
      (flag) => flag.type === "module" && isMatchedByRoute(flag.featureUrl, req)
    );
  if (currentModule && !currentModule.enabled) {
    return NextResponse.redirect(
      `${req.nextUrl.origin}${currentModule.fallbackUrl}`
    );
  }
  if (
    currentModule &&
    currentModule.enabled &&
    "allowedRoles" in currentModule
  ) {
    const fallbackUrl = new URL(
      `${req.nextUrl.origin}${currentModule.fallbackUrl}`
    );
    fallbackUrl.searchParams.set("reason", "Access Denied");
    const publicMetadata = sessionClaims?.publicMetadata;

    if (
      !hasRequiredRoles(
        currentModule.allowedRoles as unknown as string[],
        publicMetadata
      )
    ) {
      return NextResponse.redirect(fallbackUrl);
    }
  }
};

const handleRouteProtection = (
  sessionClaims: CustomJwtSessionClaims | null,
  req: NextRequest
) => {
  if (!isAPI(req)) {
    return (
      handleRouteAuthentication(sessionClaims, req) ||
      handleCheckEmailDomain(sessionClaims, req) ||
      handleCheckOnboarding(sessionClaims, req) ||
      handleModuleFeatureFlag(sessionClaims, req)
    );
  }
};

export default clerkMiddleware(async (auth, req) => {
  const authObject = await auth();

  /*TODO Fix this -> Will cause runtime errors when using roles and publicMetadata is not populated */
  const sessionClaims: CustomJwtSessionClaims | null = authObject.userId
    ? authObject.sessionClaims
    : null;

  return (
    handleApiProtection(sessionClaims, req) ||
    handleRouteProtection(sessionClaims, req) ||
    NextResponse.next()
  );
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
