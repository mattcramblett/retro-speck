import { Title } from "@/components/brand/title";

export default async function RetroBoard({
  params,
}: {
  params: { publicId: string };
}) {
  return (
    <main>
      <Title>
        {params.publicId}
      </Title>
    </main>
  );
}
