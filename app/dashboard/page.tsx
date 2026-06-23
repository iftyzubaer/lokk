import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import CreateRoomForm from "@/components/create-room-form";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Welcome, {session.user?.name}</h1>
        <p className="text-gray-500 text-sm">{session.user?.email}</p>
      </div>

      <div className="flex flex-col items-center gap-3 w-full">
        <h2 className="text-lg font-medium">Create a room</h2>
        <CreateRoomForm />
      </div>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button type="submit" className="text-sm text-gray-400 underline">
          Sign out
        </button>
      </form>
    </main>
  );
}