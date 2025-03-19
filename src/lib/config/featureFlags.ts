import toBoolean from "../utils/toBoolean";

const FEATURE_FLAGS = {
  onboarding: {
    enabled: toBoolean(process.env.FEATURE_FLAG_ONBOARDING),
    title: "Onboarding",
    description: "Onboarding flow for new users",
    type: "check",
    featureUrl: "/onboarding",
    fallbackUrl: "/",
  },
  check_email_domains: {
    enabled: toBoolean(process.env.FEATURE_FLAG_CHECK_EMAIL_DOMAINS),
    title: "Check email domain",
    description: "Check email domains",
    type: "check",
    featureUrl: "/banned",
    fallbackUrl: "/",
  },
  file_view: {
    enabled: toBoolean(process.env.FEATURE_FLAG_FILE_VIEW),
    title: "View Files",
    description: "Access files shared by classmates or teachers",
    type: "module",
    featureUrl: "/file-share",
    fallbackUrl: "/feature-unavailable?feature=file_view",
  },
  file_upload: {
    enabled: toBoolean(process.env.FEATURE_FLAG_FILE_UPLOAD),
    title: "Upload Files",
    description: "Store classroom notes into a shared storage",
    type: "module",
    featureUrl: "/file-share",
    fallbackUrl: "/feature-unavailable?feature=file_upload",
  },
} as const;

export default FEATURE_FLAGS;
