import { Title } from "@/components/brand/title";
import { getCurrentUser } from "@/lib/server-actions/auth-actions";
import { CreateRetroForm } from "@/components/home/create-retro-form";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="size-full flex items-center justify-center">
      <div className="container">
        <Title className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl p-2 md:p-4 whitespace-normal">
          Team Restrospectives done better.
        </Title>
        { user && <CreateRetroForm /> }
      </div>
    </main>
  );
}
