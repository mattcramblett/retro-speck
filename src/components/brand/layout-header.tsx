"use client";
import { Header } from "../ui/header";
import { Title } from "./title";
import { Logo } from "./logo";
import Link from "next/link";
import { useSignOut, useUser } from "@/hooks/auth/use-user";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function LayoutHeader() {
  const router = useRouter();
  const { data: user } = useUser();
  const { mutate: signOut } = useSignOut({
    onSuccess: () => setTimeout(() => {
      if (window.location.pathname === "/") {
        location.reload();
      } else {
        router.push("/");
      }
    }, 500),
  });

  return (
    <Header>
      <div className="flex w-fit items-center gap-2">
        <Logo size={24} linkToHome />
        <Link href={"/"}>
          <Title responsive={true} />
        </Link>
      </div>
      {user && (
        <Button
          variant="link"
          className="text-muted-foreground"
          onClick={() => signOut()}
        >
          Sign out
        </Button>
      )}
    </Header>
  );
}
