import { auth } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">Lokk</h1>
      <p className="text-gray-500">Study with friends. Lock in together.</p>
      {session ? (
        <Link href="/dashboard" className="rounded-md bg-black px-4 py-2 text-white">
          Go to dashboard
        </Link>
      ) : (
        <Link href="/login" className="rounded-md bg-black px-4 py-2 text-white">
          Sign in
        </Link>
      )}
    </main>
  );
}