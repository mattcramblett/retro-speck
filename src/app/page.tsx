import { Title } from "@/components/brand/title";
import { getCurrentUser } from "@/lib/server-actions/authN-actions";
import { CreateRetroForm } from "@/components/home/create-retro-form";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="size-full flex items-center justify-center">
      <div className="container">
        <Title className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl p-2 md:p-4 whitespace-normal">
          Team Restrospectives done better.
        </Title>
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
      </div>
    </main>
  );
}
