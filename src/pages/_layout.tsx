import { Footer } from "@/lib/components/Footer";
import { NavBar } from "@/lib/components/Navbar";
import React from "react";

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <NavBar />
      <main className=" container mx-auto flex-1 flex flex-col justify-center p-2">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
