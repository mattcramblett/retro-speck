import React, { ReactNode } from "react";

const Header = ({ children }: { children: ReactNode }) => {
  return (
    <header id="header" className="sticky top-0 z-40 w-full backdrop-blur flex flex-col items-center transition-all">
      <div className="container flex h-14 items-center px-4 w-full">
        <div className="w-full h-full items-center flex justify-between">
          {children}
        </div>
      </div>
    </header>
  );
}

export { Header }
