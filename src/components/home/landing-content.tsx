"use client";

import { useUser } from "@/hooks/auth/use-user";

import { CreateRetroForm } from "@/components/home/create-retro-form";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

export function LandingContent() {
  const { data: user, isPending: isUserPending } = useUser();

  if (isUserPending) {
    return <Skeleton className="h-12 max-w-24" />;
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
