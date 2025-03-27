import Link from "next/link";

import { t } from "@/constants";
import { Link as RadixLink } from "@radix-ui/themes";
import { Suspense } from "react";
import AdditionalButtons from "./additional-buttons";
import NavbarUser from "./navbar-user";

const NavBar = () => {
  return (
    <header style={{ borderBottom: "1px solid var(--accent-2)" }}>
      <nav className="container mx-auto p-2">
        <div className="flex flex-row items-center justify-between">
          <div>
            <RadixLink underline="none" weight="bold" asChild>
              <Link href="/">{t.index.title}</Link>
            </RadixLink>
          </div>
          <Suspense>
            <div className="flex flex-row items-center gap-4">
              <AdditionalButtons />
              <NavbarUser />
            </div>
          </Suspense>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
