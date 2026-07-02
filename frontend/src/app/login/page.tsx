import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
        padding: 24,
      }}
    >
      <LoginForm />
    </main>
  );
}
