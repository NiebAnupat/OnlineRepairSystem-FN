import React, { PropsWithChildren, useEffect, useState } from "react";
import { AppShell } from "@mantine/core";
import MyNavbar from "./Navbar/MyNavbar";
import { useUserStore } from "../lib/userStore";

export default function Layout({ children }: PropsWithChildren) {
  const user = useUserStore((state) => state.user);
  // const notSignIn = user === null;
  const [notSignIn, setNotSignIn] = useState<boolean>(true);

  useEffect(() => {
    if (user === null) {
      setNotSignIn(true);
    } else {
      setNotSignIn(false);
    }
  }, [user]);

  return (
    <AppShell navbar={<MyNavbar />} hidden={notSignIn}>
      <div>{children}</div>
    </AppShell>
  );
}
