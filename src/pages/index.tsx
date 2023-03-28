import React from "react";
import {
  TextInput,
  Button,
  Container,
  Text,
  Box,
  Image,
  PasswordInput,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconKey, IconLogin, IconUser } from "@tabler/icons-react";
import illustration from "@/assets/IllustrationProjectManager/SVG/Illustration2.svg";
import { useUserStore } from "@/lib/userStore";
import User from "@/models/User";
import { useRouter } from "next/router";

export default function index() {
  const router = useRouter();

  const [id, setID] = useDebouncedState<string>("", 200);
  const [password, setPassword] = useDebouncedState<string>("", 200);
  const handleIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setID(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const { setUser } = useUserStore();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newUser: User = {
      id: id,
      name: "ทดสอบ พนักงาน",
      role: "employee",
    };
    setUser(newUser);
    router.reload();
  };

  return (
    <Box h={"100vh"} w={"100vw"} p={"xl"} bg={"gray.1"}>
      <Container
        h={"100%"}
        size={"90vw"}
        sx={{
          minWidth: "80rem",
          minHeight: "40rem",
        }}
      >
        <Box
          bg={"white"}
          h={"100%"}
          display={"flex"}
          sx={{
            borderRadius: "20px",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            border: "1px solid #E5E7EB",
          }}
        >
          <Box
            bg={"white"}
            sx={{
              flexGrow: 1,
              textAlign: "center",
              borderRadius: "20px 0 0 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src={illustration}
              width={"45rem"}
              mx={"auto"}
              sx={{
                filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                zIndex: 1,
                position: "absolute",
                minHeight: "30rem",
                minWidth: "40rem",
              }}
            />
            <Box
              sx={(theme) => ({
                backgroundImage: `linear-gradient(to bottom right, ${theme.colors.indigo[8]}, ${theme.colors.violet[2]})`,
                borderRadius: "44% 56% 69% 31% / 33% 39% 61% 67% ",
                width: "40rem",
                height: "30rem",
                // width: "40vw",
                // height: "30vw",
                position: "absolute",
                opacity: 0.8,
                zIndex: 0,
                minHeight: "30rem",
                minWidth: "40rem",
              })}
            ></Box>
          </Box>
          <Box
            w={"40%"}
            sx={{
              borderRadius: "0 20px 20px 0",
              textAlign: "center",
              minWidth: "30rem",
            }}
          >
            <Text
              fz={"1.5rem"}
              fw={600}
              // c={"white"}
              mt={"40%"}
            >
              ระบบแจ้งซ่อมออนไลน์
            </Text>
            <Container size={"60%"}>
              <form onSubmit={handleSubmit}>
                <TextInput
                  mt={"xl"}
                  // variant="filled"
                  label="รหัสพนักงาน"
                  onChange={handleIDChange}
                  icon={<IconUser />}
                />
                <PasswordInput
                  mt={"sm"}
                  // variant="filled"
                  label="รหัสผ่าน"
                  onChange={handlePasswordChange}
                  icon={<IconKey />}
                />
                <Button
                  mt={"xl"}
                  type="submit"
                  w={"80%"}
                  variant="gradient"
                  gradient={{ from: "indigo", to: "cyan" }}
                  leftIcon={<IconLogin />}
                >
                  เข้าสู่ระบบ
                </Button>
              </form>
            </Container>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
