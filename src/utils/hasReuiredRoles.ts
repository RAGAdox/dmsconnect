export default function hasRequiredRoles(
  requiredRoles: string[],
  publicMetadata: SessionPublicMetadata | undefined
) {
  const userRoles = publicMetadata?.roles;
  return (
    userRoles && userRoles.some((role) => new Set(requiredRoles).has(role))
  );
}
