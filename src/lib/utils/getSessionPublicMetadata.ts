import ROLES_ARRAY from "../constants/roles";

export default function getSessionPublicMetadata(
  publicMetadata: UserPublicMetadata
): SessionPublicMetadata {
  return {
    onboardingComplete: Boolean(publicMetadata["onboardingComplete"]),
    roles: (publicMetadata.roles as (typeof ROLES_ARRAY)[number][]) || [],
  };
}
