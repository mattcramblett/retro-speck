import { Title } from "@/components/brand/title";
import { LandingContent } from "@/components/home/landing-content";

export default async function Home() {
  return (
    <main className="size-full flex items-center justify-center">
      <div className="container">
        <Title className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl p-2 md:p-4 whitespace-normal">
          Quick and easy team retrospectives.
        </Title>
        <LandingContent />
      </div>
    </main>
  );
}
