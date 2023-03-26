import { Text, Navbar } from "@mantine/core";
import React from "react";

export default function MyNavbar() {
  return (
    <>
      <Navbar p="md" height="100vh" width={{ base: 250 }}>
        <Navbar.Section >
          <Text >My App</Text>
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
