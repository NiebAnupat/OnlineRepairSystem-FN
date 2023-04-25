import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Collapse, createStyles, Group, rem, Text, ThemeIcon, UnstyledButton} from "@mantine/core";
import {IconChevronLeft, IconChevronRight} from "@tabler/icons-react";

interface Props {
    icon: React.ReactNode;
    label: string;
    href?: string;
    color: string;
    colorLevel: number;
    links?: { label: string; link: string }[];
    initiallyOpened?: boolean;
}

const useStyles = createStyles(() => ({
    chevron: {
        transition: 'transform 200ms ease',
    },
}));
export default function NavLink({icon, label, color, href, colorLevel, links, initiallyOpened}: Props) {
    const router = useRouter();
    const hasLinks = Array.isArray(links);
    const {classes, theme} = useStyles();
    const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft;
    const [opened, setOpened] = useState<boolean>(initiallyOpened || true);
    const handleClick = () => {
        console.log('hasLinks', hasLinks)
        if (hasLinks) {
            setOpened((opened) => !opened);
        } else {
            href && router.push(href);
        }
    };

    const items = (hasLinks ? links : []).map((link) => (
        <Text
            key={link.label}
            onClick={() => router.push(link.link)}
            sx={{
                display: 'block',
                cursor: 'pointer',
                textDecoration: 'none',
                padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                paddingLeft: rem(31),
                marginLeft: rem(30),
                fontSize: theme.fontSizes.sm,
                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
                borderLeft: `${rem(1)} solid ${
                    theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
                }`,

                '&:hover': {
                    backgroundColor: theme.colors[color][theme.colorScheme === "dark" ? 9 : 0],
                    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
                },
            }}
        >
            {link.label}
        </Text>
    ))

    return (
        <>
            <UnstyledButton
                onClick={handleClick}
                sx={(theme) => ({
                    display: "block",
                    width: "100%",
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                    color:
                        theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

                    "&:hover": {
                        backgroundColor:
                            theme.colors[color][theme.colorScheme === "dark" ? 9 : 0],
                    },
                })}
            >
                <Group>
                    <ThemeIcon color={color + "." + colorLevel} variant="light">
                        {icon}
                    </ThemeIcon>
                    <Text size="sm">{label}</Text>
                    {hasLinks && (
                        <ChevronIcon
                            className={classes.chevron}
                            size="1rem"
                            stroke={1.5}
                            style={{
                                transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none',
                            }}
                        />
                    )}
                </Group>
            </UnstyledButton>
            {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
        </>
    )

}
