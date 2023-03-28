import React, { PropsWithChildren, useEffect } from "react";
import { AppShell } from "@mantine/core";
import MyNavbar from "./Navbar/MyNavbar";
import { useUserStore } from "../lib/userStore";
import SignIn from "@/pages/SignIn";
import { useRouter } from "next/router";

export default function Layout({ children }: PropsWithChildren) {

  const { user } = useUserStore();
  const notSignIn = user === null;

  return (
    <AppShell navbar={<MyNavbar />} hidden={notSignIn}>
      <div>{children}</div>
    </AppShell>
  );
}
