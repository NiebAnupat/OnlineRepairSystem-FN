import React from "react";
import {useRouter} from "next/router";
import {Group, Text, ThemeIcon, UnstyledButton} from "@mantine/core";

interface Props {
    icon: React.ReactNode;
    label: string;
    href: string;
    color: string;
    colorLevel: number;
}

export default function NavLink({
  icon,
  label,
  color,
  href,
  colorLevel,
}: Props) {
  const router = useRouter();
  const handleClick = () => {
    router.push(href);
  };

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
        </Group>
      </UnstyledButton>
    </>
  );
}
