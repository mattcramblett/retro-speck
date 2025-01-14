"use client";

import { useUser } from "@/hooks/auth/use-user";

import { CreateRetroForm } from "@/components/home/create-retro-form";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function LandingContent() {
  const { data: user, isPending: isUserPending } = useUser();

  if (isUserPending) {
    return <div className="h-28" />;
  }

  return (
    <>
      {user && <CreateRetroForm />}
      {!user && (
        <div className="w-full flex items-end justify-start gap-4 p-4">
          <Link href="/login">
            <div className="flex items-center font-bold gap-2">
              {"Get Started"}
              <ChevronRight />
            </div>
          </Link>
        </div>
      )}
    </>
  );
}
