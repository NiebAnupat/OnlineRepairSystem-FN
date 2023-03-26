import React, { PropsWithChildren } from "react";
import { AppShell } from "@mantine/core";
import MyNavbar from "./MyNavbar";
import { useUserStore } from "../lib/userStore";
import SignIn from "@/pages/SignIn";

export default function Layout({ children }: PropsWithChildren) {
  const { user } = useUserStore();
  const isLoggedIn = user !== null;
  console.log("Layout.tsx: isLoggedIn = ", isLoggedIn);

  if (!isLoggedIn) {
    return <SignIn />;
  }

  return (
    <AppShell navbar={<MyNavbar />} hidden={!isLoggedIn}>
      <div>{children}</div>
    </AppShell>
  );
}
