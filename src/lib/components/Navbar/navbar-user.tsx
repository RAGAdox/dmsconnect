"use client";

import toBoolean from "@/lib/utils/toBoolean";
import { SignInButton, useClerk, useUser } from "@clerk/nextjs";
import { Avatar, Button, DropdownMenu, Skeleton } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";

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

  const searchParams = useSearchParams();
  const router = useRouter();
  const promptLogin = toBoolean(searchParams?.get("promptLogin") || "");

  useEffect(() => {
    if (promptLogin && isLoaded && !user) {
      openSignIn({ withSignUp: true });
    }
    if (promptLogin && isLoaded && user) {
      const urlSearchParams = new URLSearchParams(searchParams ?? undefined);
      urlSearchParams.delete("promptLogin");
      router.replace(`?${urlSearchParams.toString()}`, { scroll: false });
    }
  }, [promptLogin, isLoaded, user, openSignIn, searchParams, router]);

  if (!isLoaded)
    return (
      <div>
        <Skeleton>
          <Avatar fallback size="2" />
        </Skeleton>
      </div>
    );
  if (isLoaded && user)
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
          <DropdownMenu.Content>
            <DropdownMenu.Item>Go to Admin Dashboard</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onClick={() => signOut()}>
              Logout
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    );
  return (
    <div>
      <SignInButton mode="modal" withSignUp>
        <Button>Login/Signup</Button>
      </SignInButton>
    </div>
  );
};

export default NavbarUser;
