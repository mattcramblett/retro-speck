import { Header } from "../ui/header";
import { Title } from "./title";
import { Logo } from "./logo";
import Link from "next/link";

export function LayoutHeader() {
  return (
    <Header>
      <div className="flex w-fit items-center gap-2">
        <Logo size={24} linkToHome />
        <Link href={"/"}>
          <Title responsive={true} />
        </Link>
      </div>
    </Header>
  );
}
