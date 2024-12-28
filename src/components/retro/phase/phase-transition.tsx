import { SplashScreen } from "@/components/brand/splash-screen";
import { Title } from "@/components/brand/title";
import { Phase } from "@/types/model";

type PhaseTransitionProps = {
  active?: boolean,
  phase?: Phase,
}
export function PhaseTransition({ active, phase }: PhaseTransitionProps) {
  return (
    <SplashScreen dataState={ active ? "active" : "inactive" } className="data-[state=inactive]:hidden data-[state=active]:animate-in data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=active]:fade-in-0">
      <Title className="text-2xl text-secondary">
        {phase?.label}
      </Title>
    </SplashScreen>
  );
}
