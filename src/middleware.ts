import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import getFeatureFlags from "./lib/utils/getFeatureFlags";

const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);
const isProtectedRoute = createRouteMatcher([
  "/file-share(.*)",
  "/onboarding(.*)",
]);
const isOnboardingApi = createRouteMatcher(["/api/onboard"]);
const isProtectedApi = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const featureFlags = await getFeatureFlags();
  const { userId, sessionClaims } = await auth();
  const publicMetadata = sessionClaims
    ? (sessionClaims.metadata as PublicMetadata)
    : undefined;

  /* API Protection */
  if (isProtectedApi(req)) {
    if (!userId || !publicMetadata) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (
      userId &&
      featureFlags.onboarding &&
      !publicMetadata.onboardingComplete &&
      !isOnboardingApi(req)
    ) {
      return NextResponse.json(
        { error: "Onboarding Required" },
        { status: 403 }
      );
    }
  }

  /* Route Protection */
  if (isProtectedRoute(req)) {
    if (!userId || !publicMetadata) {
      return NextResponse.redirect(`${req.nextUrl.origin}?promptLogin=true`);
    }
    if (
      userId &&
      featureFlags.onboarding &&
      !publicMetadata.onboardingComplete &&
      !isOnboardingRoute(req)
    ) {
      return NextResponse.redirect(`${req.nextUrl.origin}/onboarding`);
    }
    if (userId && publicMetadata.onboardingComplete && isOnboardingRoute(req)) {
      return NextResponse.redirect(`${req.nextUrl.origin}`);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
