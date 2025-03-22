import Link from "next/link";

import { t } from "@/lib/constants";
import { Suspense } from "react";
import NavbarUser from "./navbar-user";

const NavBar = () => {
  return (
    <header style={{ borderBottom: "1px solid var(--accent-2)" }}>
      <nav className="container mx-auto p-2">
        <div className="flex flex-row items-center justify-between">
          <div>
            <Link href="/">{t.index.title}</Link>
          </div>
          <div>
            <Suspense>
              <NavbarUser />
            </Suspense>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
