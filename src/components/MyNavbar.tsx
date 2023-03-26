import { useUserStore } from "@/lib/userStore";
import { Text, Navbar } from "@mantine/core";
import React from "react";

export default function MyNavbar() {
  const { user } = useUserStore();
  return (
    <>
      <Navbar p="md" height="100vh" width={{ base: 250 }}>
        <Navbar.Section>
          <Text>{user!.name}</Text>
        </Navbar.Section>
        <Navbar.Section grow>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </Navbar.Section>
        <Navbar.Section>
          <h2>Footer</h2>
        </Navbar.Section>
      </Navbar>
    </>
  );
}
