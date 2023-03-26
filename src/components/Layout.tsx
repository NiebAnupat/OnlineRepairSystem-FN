import React, { PropsWithChildren, useEffect } from "react";
import { AppShell } from "@mantine/core";
import MyNavbar from "./MyNavbar";
import { useUserStore } from "../lib/userStore";
import SignIn from "@/pages/SignIn";
import { User } from "../models/User";

export default function Layout({ children }: PropsWithChildren) {
  const { user } = useUserStore();
  const notSignIn = user === null;

  useEffect(() => {
    console.log("Layout");
    const newUser: User = null;
    useUserStore.setState({ user: newUser });
  }, []);

  if (notSignIn) {
    return <SignIn />;
  }

  return (
    <AppShell navbar={<MyNavbar />} hidden={notSignIn}>
      <div>{children}</div>
    </AppShell>
  );
}
