import React, { PropsWithChildren, useEffect, useState } from "react";
import { AppShell } from "@mantine/core";
import MyNavbar from "./Navbar/MyNavbar";
import { useUserStore } from "@/lib/userStore";
import { useRouter } from "next/router";

export default function Layout({ children }: PropsWithChildren) {
  const user = useUserStore((state) => state.user);
  const [isMounted, setIsMounted] = useState(false);

  const isIndex = useRouter().pathname === "/";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <AppShell navbar={<MyNavbar />} padding={0} hidden={!user || isIndex}>
      <div style={{
        height: '100%',
      }}>{children}</div>
    </AppShell>
  );
}
