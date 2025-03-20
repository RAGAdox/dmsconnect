import { Container, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { Suspense } from "react";
import NavbarUser from "./navbar-user";

import getFeatureFlags from "@/lib/utils/getFeatureFlags";

const NavBar = async () => {
  const featureFlags = await getFeatureFlags();
  console.log(featureFlags);
  return (
    <Container style={{ borderBottom: "1px solid var(--accent-2)" }}>
      <Flex direction="row" flexGrow="1" justify="between" align="center" p="2">
        <div>
          <Link href="/">DMS Connect</Link>
        </div>
        <div>
          <Suspense>
            <NavbarUser />
          </Suspense>
        </div>
      </Flex>
    </Container>
  );
};

export default NavBar;
