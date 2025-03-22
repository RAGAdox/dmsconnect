import COURSES_ARRAY from "@/lib/constants/courses";
import ROLES_ARRAY from "@/lib/constants/roles";

declare global {
  type FeatureFlags = {
    [key in (typeof featureFlagsArray)[number]]: boolean;
  };
  interface OnboardingArgs {
    registrationNumber: string;
    course: (typeof COURSES_ARRAY)[number];
  }

  interface PublicMetadata {
    onboardingComplete: boolean;
    roles: (typeof ROLES_ARRAY)[number];
  }
}
