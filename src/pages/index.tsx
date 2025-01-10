import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1>Welcome {session.user?.email}</h1>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
