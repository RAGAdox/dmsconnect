import { $Enums } from "@prisma/client";

declare global {
  interface OnboardingArgs {
    registrationNumber: string;
    course: $Enums.course;
    startYear: number;
    endYear: number;
  }

  interface SessionPublicMetadata {
    onboardingComplete: boolean;
    roles: $Enums.roles[];
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
    [key: $Enums.subject_code]: IFFiles[];
  }

  interface IFRecords {
    [key: $Enums.course]: IFSubjectRecords;
  }
}
