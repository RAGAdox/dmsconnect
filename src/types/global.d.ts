import COURSES_ARRAY from "@/lib/constants/courses";
import ROLES_ARRAY from "@/lib/constants/roles";

declare global {
  interface OnboardingArgs {
    registrationNumber: string;
    course: (typeof COURSES_ARRAY)[number];
    startYear: number;
    endYear: number;
  }

  interface SessionPublicMetadata {
    onboardingComplete: boolean;
    roles: (typeof ROLES_ARRAY)[number][];
  }

  interface CustomJwtSessionClaims extends JwtPayload {
    id: string;
    email: string;
    publicMetadata?: SessionPublicMetadata;
  }

  interface ClerkForceRedirectUrls {
    signInForceRedirectUrl: string;
    signUpForceRedirectUrl: string;
  }
}
