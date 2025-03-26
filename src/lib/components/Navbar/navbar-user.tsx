import getSessionPublicMetadata from "@/lib/utils/getSessionPublicMetadata";
import toBoolean from "@/lib/utils/toBoolean";
import { SignInButton, useClerk, useUser } from "@clerk/nextjs";
import { Avatar, Button, DropdownMenu, Skeleton, Text } from "@radix-ui/themes";
import { useRouter } from "next/router";

import { useEffect } from "react";

const getInitials = (name: string) => {
  const initialCharacters = name
    .split(" ")
    .map((v) => v.charAt(0))
    .join("");
  return initialCharacters.slice(0, 2);
};

const NavbarUser = () => {
  const { isLoaded, user } = useUser();

  const { openSignIn, signOut } = useClerk();

  const router = useRouter();
  const { query } = router;

  const promptLogin =
    typeof query.promptLogin === "string"
      ? toBoolean(query.promptLogin)
      : false;

  useEffect(() => {
    if (promptLogin && isLoaded && !user) {
      openSignIn({ withSignUp: true });
    }
    if (promptLogin && isLoaded && user) {
      const urlSearchParams = new URLSearchParams(
        router.asPath.split("?")[1] ?? undefined
      );
      urlSearchParams.delete("promptLogin");
      router.replace(`?${urlSearchParams.toString()}`);
    }
  }, [promptLogin, isLoaded, user, openSignIn, router]);

  if (!isLoaded)
    return (
      <div>
        <Skeleton>
          <Avatar fallback size="2" />
        </Skeleton>
      </div>
    );
  if (isLoaded && user) {
    const publicMetadata = getSessionPublicMetadata(user.publicMetadata);
    const primaryEmail = user.primaryEmailAddress?.emailAddress;
    const fullName = user.fullName;
    return (
      <div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <div>
              <Avatar
                fallback={getInitials(user.fullName || user.username || "")}
                size="2"
              />
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            <div className="px-3">
              <Text as="p" size="2" className="capitalize">
                {fullName}
              </Text>
              <Text size="2" as="p">
                {primaryEmail}
              </Text>
            </div>

            <DropdownMenu.Separator />
            {publicMetadata.roles.includes("admin") && (
              <>
                <DropdownMenu.Group>
                  <DropdownMenu.Item>Go to Admin Dashboard</DropdownMenu.Item>
                </DropdownMenu.Group>
                <DropdownMenu.Separator />
              </>
            )}

            <DropdownMenu.Group>
              <DropdownMenu.Item onClick={() => signOut()}>
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    );
  }
  return (
    <div>
      <SignInButton mode="modal" withSignUp>
        <Button>Login/Signup</Button>
      </SignInButton>
    </div>
  );
};

export default NavbarUser;
