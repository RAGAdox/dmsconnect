import { Footer } from "@/lib/components/Footer";
import { NavBar } from "@/lib/components/Navbar";
import { Theme } from "@radix-ui/themes";
import React from "react";
import { Slide, ToastContainer } from "react-toastify";

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Theme
        accentColor="orange"
        radius="full"
        className="flex flex-col flex-1 min-h-svh"
      >
        <NavBar />
        <ToastContainer
          position="top-right"
          newestOnTop
          closeOnClick={true}
          transition={Slide}
          closeButton={false}
          hideProgressBar
          className="pt-[48px] pr-2"
        />
        <main className=" container mx-auto flex-1 flex flex-col justify-center p-2">
          {children}
        </main>
        <Footer />
      </Theme>
    </>
  );
};

export default Layout;
