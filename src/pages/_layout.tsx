import { Footer } from "@/lib/components/Footer";
import { NavBar } from "@/lib/components/Navbar";
import { Theme } from "@radix-ui/themes";
import React from "react";

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Theme
        accentColor="orange"
        radius="full"
        className="flex flex-col flex-1 min-h-svh"
      >
        <NavBar />
        <main className=" container mx-auto flex-1 flex flex-col justify-center p-2">
          {children}
        </main>
        <Footer />
      </Theme>
    </>
  );
};

export default Layout;
