import { cn } from "@/lib/utils";

interface TitleProps extends React.HTMLAttributes<HTMLDivElement> {
  responsive?: boolean;
}

export function Title({ responsive, ...props }: TitleProps) {
  const reponsiveStyle = responsive
    ? "w-0 invisible lg:w-fit lg:visible"
    : null;
  return (
    <h1
      className={cn(
        "my-4 text-xl bg-gradient text-transparent tracking-tigher uppercase !bg-clip-text font-black whitespace-nowrap",
        reponsiveStyle,
      )}
      {...props}
    >
      Retro Speck
    </h1>
  );
}
