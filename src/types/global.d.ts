import COURSES_ARRAY from "@/constants/courses";
import ROLES_ARRAY from "@/constants/roles";
import SUBJECT_CODE_ARRAY from "@/constants/subject";

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

  interface IFFiles {
    fileName: string;
    email: string;
  }

  interface IFSubjectRecords {
    [key: (typeof SUBJECT_CODE_ARRAY)[number]]: IFFiles[];
  }

  interface IFRecords {
    [key: (typeof COURSES_ARRAY)[number]]: IFSubjectRecords;
  }
}
