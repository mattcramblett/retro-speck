import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TitleProps extends React.HTMLAttributes<HTMLDivElement> {
  responsive?: boolean;
  children?: ReactNode;
}

export function Title({ responsive, className, children, ...props }: TitleProps) {
  const reponsiveStyle = responsive
    ? "w-0 invisible lg:w-fit lg:visible"
    : null;
  return (
    <h1
      className={cn(
        "my-4 text-xl bg-gradient text-transparent tracking-tigher uppercase !bg-clip-text font-black whitespace-nowrap",
        reponsiveStyle,
        className,
      )}
      {...props}
    >
      { children || "Retro Speck" }
    </h1>
  );
}
