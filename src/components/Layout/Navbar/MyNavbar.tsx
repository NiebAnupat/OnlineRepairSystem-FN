import {useUserStore} from "@/lib/userStore";
import User from "@/models/User";
import {Avatar, Box, Divider, Group, Image, Navbar, Text, ThemeIcon, UnstyledButton,} from "@mantine/core";
import {IconHistory, IconHome, IconLogout, IconTableOptions, IconUser, IconUserEdit,} from "@tabler/icons-react";
import React from "react";
import NavLink from "./_NavLink";
import repair from "@/assets/SVG/repair.svg";
import {useRouter} from "next/router";
import {bufferToUrl} from "@/lib/helper";

interface NavLinkData {
    icon: React.ReactNode;
    label: string;
    href?: string;
    color: string;
    colorLevel: number;
    links?: { label: string; link: string }[];
    initiallyOpened?: boolean;
}

export default function MyNavbar() {
    const router = useRouter();
    const user: User | null = useUserStore((state) => state.user);
    const displayName = user && user.username ? user.username : "ไม่พบชื่อผู้ใช้";
    const displayRole =
        user && user.user_role ? user.user_role : "ไม่พบสิทธิ์ผู้ใช้";

    const navLinkData_Employee: NavLinkData[] = [
        {
            icon: <IconHome/>,
            label: "หน้าหลัก",
            color: "blue",
            colorLevel: 6,
            href: "/User",
        },
        {
            icon: <IconTableOptions/>,
            label: "แจ้งซ่อม",
            color: "green",
            colorLevel: 6,
            href: "/User/repairing",
        },
        {
            icon: <IconHistory/>,
            label: "ประวัติ",
            color: "violet",
            colorLevel: 5,
            href: "/User/history",
        },
        {
            icon: <IconUser/>,
            label: "ข้อมูลส่วนตัว",
            color: "orange",
            colorLevel: 5,
            href: "/User",
        },
    ];
    const navLinkData_Worker: NavLinkData[] = [
        {
            icon: <IconHome/>,
            label: "หน้าหลัก",
            color: "blue",
            colorLevel: 6,
            href: "/Worker",
        },
        {
            icon: <IconTableOptions/>,
            label: "งานแจ้งซ่อม",
            color: "green",
            colorLevel: 6,
            links: [
                {label: 'รายการใหม่', link: '/Worker/Tasks/Check'},
                {label: 'รายการของฉัน', link: '/Worker/Tasks/Repairing'},
                {label: 'ประวัติ', link: '/Worker/Tasks/History'},
            ]
        },
        {
            icon: <IconUser/>,
            label: "ข้อมูลส่วนตัว",
            color: "orange",
            colorLevel: 5,
            href: "/User",
        }
    ];

    const navLinkData_Admin: NavLinkData[] = [
        {
            icon: <IconTableOptions/>,
            label: "จัดการข้อมูลการแจ้งซ่อม",
            color: "green",
            colorLevel: 6,
            href: "/Admin/Manage/Repair",
        },
        {
            icon: <IconUserEdit/>,
            label: "จัดการข้อมูลผู้ใช้งาน",
            color: "violet",
            colorLevel: 6,
            href : '/Admin/Manage/User',
        },
        {
            icon: <IconUser/>,
            label: "ข้อมูลส่วนตัว",
            color: "orange",
            colorLevel: 5,
            href: "/User",
        }
    ];

    const getNavLinkData = () => {
        switch (displayRole) {
            case "employee":
                return navLinkData_Employee;
            case "worker":
                return navLinkData_Worker;
            case "admin":
                return navLinkData_Admin;
            default:
                return [];
        }
    }

    const handleSignOut = () => {
        useUserStore.getState().signOut();
        router.reload();
    };

    // display role in thai
    const displayRoleInThai = () => {
        switch (displayRole) {
            case "admin":
                return "ผู้ดูแลระบบ";
            case "employee":
                return "พนักงานทั่วไป";
            case "worker":
                return "ช่างซ่อม";
            default:
                return "ไม่พบสิทธิ์ผู้ใช้";
        }
    }


    return (
        <Navbar p="md" height="100vh" width={{base: 250}} sx={{
            userSelect: "none",
        }}>
            <Navbar.Section
                display={"flex"}
                mt="xs"
                sx={{
                    alignItems: "center",
                    justifyContent: "start",
                }}
            >
                <Image src={repair} width={"3.5rem"} mr={"sm"} mt={"-0.7rem"}/>
                <Text
                    fz={"md"}
                    fw={600}
                    sx={{
                        flexGrow: 1,
                    }}
                >
                    ระบบแจ้งซ่อมออนไลน์
                </Text>
            </Navbar.Section>
            <Divider mt={"md"} mb={"sm"}/>
            <Navbar.Section grow>
                {getNavLinkData().map((data) => (
                    <NavLink
                        key={data.label}
                        icon={data.icon}
                        label={data.label}
                        color={data.color}
                        colorLevel={data.colorLevel}
                        href={data.href}
                        links={data.links}
                    />
                ))}
                {/*<NavbarLinksGroup displayRole={displayRole}/>*/}
            </Navbar.Section>
            <Navbar.Section>
                <UnstyledButton
                    onClick={handleSignOut}
                    sx={(theme) => ({
                        display: "block",
                        width: "100%",
                        padding: theme.spacing.xs,
                        borderRadius: theme.radius.sm,
                        color:
                            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

                        "&:hover": {
                            backgroundColor:
                                theme.colors["red"][theme.colorScheme === "dark" ? 9 : 0],
                        },
                    })}
                >
                    <Group>
                        <ThemeIcon color={"red.5"} variant="light">
                            <IconLogout/>
                        </ThemeIcon>

                        <Text size="sm">ออกจากระบบ</Text>
                    </Group>
                </UnstyledButton>
            </Navbar.Section>
            <Divider my={"md"}/>
            <Navbar.Section
                display={"flex"}
                sx={{
                    alignItems: "center",
                    justifyContent: "start",
                }}
            >
                <Avatar
                    src={user && user.avatar ? bufferToUrl(user.avatar) : undefined}
                    radius={"xl"}
                    size={"3rem"}
                    ml={"md"}
                />
                <Box ml={"md"}>
                    <Text fz={"md"} fw={500}>
                        {displayName}
                    </Text>
                    <Text fz={"sm"} c="dimmed">
                        {displayRoleInThai()}
                    </Text>
                </Box>
            </Navbar.Section>
        </Navbar>
    );
}
