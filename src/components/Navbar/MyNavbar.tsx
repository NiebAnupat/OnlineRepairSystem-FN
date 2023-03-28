import { useUserStore } from "@/lib/userStore";
import { User } from "@/models/User";
import { Text, Navbar, Avatar, Divider, Box } from "@mantine/core";
import { IconHome, IconTableOptions } from "@tabler/icons-react";
import React from "react";
import NavLink from "./_NavLink";
interface NavLinkData {
  icon: React.ReactNode;
  label: string;
  color: string;
  colorLevel: number;
  href: string;
}
export default function MyNavbar() {
  // const { user } = useUserStore();
  // assert user is not null
  const user: User = useUserStore((state) => state.user)!;
  const navLinkData: NavLinkData[] = [
    {
      icon: <IconHome />,
      label: "หน้าหลัก",
      color: "blue",
      colorLevel: 6,
      href: "/",
    },
    {
      icon: <IconTableOptions />,
      label: "รายการแจ้งซ่อม",
      color: "green",
      colorLevel: 6,
      href: "/repair",
    },
  ];
  return (
    <>
      <Navbar p="md" height="100vh" width={{ base: 250 }}>
        <Navbar.Section
          display={"flex"}
          mt="xs"
          sx={{
            alignItems: "center",
            justifyContent: "start",
          }}
        >
          <Text fz={"xl"} fw={600}>
            แจ้งซ่อมออนไลน์
          </Text>
        </Navbar.Section>
        <Divider mt={"md"} mb={"sm"} />
        <Navbar.Section grow>
          {navLinkData.map((data) => (
            <NavLink
              key={data.label}
              icon={data.icon}
              label={data.label}
              color={data.color}
              colorLevel={data.colorLevel}
              href={data.href}
            />
          ))}
        </Navbar.Section>
        <Divider my={"md"} />
        <Navbar.Section
          display={"flex"}
          sx={{
            alignItems: "center",
            justifyContent: "start",
          }}
        >
          <Avatar
            src={"https://api.multiavatar.com/07af9730d100f0cf16.png"}
            size={"3rem"}
            ml={"md"}
          />
          <Box ml={"md"}>
            <Text fz={"md"} fw={500}>
              {user.name}
            </Text>
            <Text fz={"sm"} c="dimmed">
              {user.role}
            </Text>
          </Box>
        </Navbar.Section>
      </Navbar>
    </>
  );
}
