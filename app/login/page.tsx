import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-3">
        <h1 className="mb-4 text-center text-2xl font-semibold">Sign in to Lokk</h1>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/dashboard" });
          }}
        >
          <button type="submit" className="w-full rounded-md bg-black px-4 py-2 text-white">
            Sign in with GitHub
          </button>
        </form>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-2 text-white">
            Sign in with Google
          </button>
        </form>
      </div>
    </main>
  );
}