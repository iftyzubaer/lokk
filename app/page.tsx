import { auth, signIn, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen items-center justify-center">
      {session ? (
        <div className="text-center">
          <p>Signed in as {session.user?.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit" className="mt-4 rounded-md bg-black px-4 py-2 text-white">
              Sign out
            </button>
          </form>
        </div>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <button type="submit" className="rounded-md bg-black px-4 py-2 text-white">
            Sign in with GitHub
          </button>
        </form>
      )}
    </main>
  );
}