import { OTPForm } from "@/components/login/otp-form";

export default function LoginPage() {
  return (
    <main className="w-full h-full flex flex-col items-center">
      <div className="size-full flex items-center justify-center">
        <OTPForm />
      </div>
    </main>
  );
}
