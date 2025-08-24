"use server";

import { auth, signIn, signOut } from "@/lib/auth";

export async function manageAuthGoogle() {
  const session = await auth();
  if (!session) {
    return await signIn("google", { redirectTo: `/dashboard` });
  } else {
    return await signOut({
      redirectTo: "/",
    });
  }
}

export async function manageAuthSignOut() {
  const session = await auth();
  if (session) {
    return await signOut({
      redirectTo: "/",
    });
  }
}
