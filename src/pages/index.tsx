import React from "react";
import { useRouter } from "next/router";
import {
  TextInput,
  Button,
  Container,
  Text,
  Box,
  Image,
  PasswordInput,
  Notification,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconKey, IconLogin, IconUser } from "@tabler/icons-react";
import illustration from "@/assets/IllustrationProjectManager/SVG/Illustration2.svg";
import { useUserStore } from "@/lib/userStore";
import User, { UserSignInResponse } from "@/models/User";
import useAxios from "@/lib/useAxios";
import axios from "axios";

export default function index() {
  const router = useRouter();
  const { setUser } = useUserStore();

  const idRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const [id, setID] = useDebouncedState<string>("", 200);
  const [password, setPassword] = useDebouncedState<string>("", 200);
  const handleIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setID(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await useAxios.post<UserSignInResponse>("auth/", {
        user_id: id,
        password: password,
      });

      const token = res.data.token;

      // save token to cookie
      document.cookie = `token=${token}; path=/`;

      router.reload();
    } catch (e: any) {
      setLoading(false);
      if (axios.isAxiosError(e)) {
        idRef.current?.value && (idRef.current.value = "");
        passwordRef.current?.value && (passwordRef.current.value = "");
        const status = e.response?.status;
        if (status === 401) {
          setError("รหัสผ่านไม่ถูกต้อง");
        } else if (status === 404) {
          setError("ไม่พบรหัสพนักงานนี้");
        } else {
          setError("เกิดข้อผิดพลาด");
        }
      } else {
        setError("เกิดข้อผิดพลาด");
      }

      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  const renderError = () => (
    <Notification
      color="red"
      radius="md"
      title="เกิดข้อผิดพลาด"
      sx={(theme) => ({
        textAlign: "center",
        position: "absolute",
        bottom: "0",
        left: "0",
        right: "0",
        margin: "auto",
        marginBottom: theme.spacing.lg,
        width: "80%",
        zIndex: 2,
        opacity: error ? 1 : 0,
        transition: "opacity 0.5s",
      })}
      withCloseButton={false}
    >
      {error}
    </Notification>
  );

  const renderLoading = () => (
    <Notification
      color="blue"
      radius="md"
      loading
      title="กำลังเข้าสู่ระบบ"
      sx={(theme) => ({
        textAlign: "center",
        position: "absolute",
        bottom: "0",
        left: "0",
        right: "0",
        margin: "auto",
        marginBottom: theme.spacing.lg,
        width: "80%",
        zIndex: 2,
        opacity: loading ? 1 : 0,
        transition: "opacity 0.5s",
      })}
      withCloseButton={false}
    >
      กรุณารอสักครู่
    </Notification>
  );

  return (
    <Box h={"100vh"} w={"100vw"} p={"xl"} bg={"gray.1"}>
      {renderLoading()}
      {renderError()}
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
                  ref={idRef}
                />
                <PasswordInput
                  mt={"sm"}
                  // variant="filled"
                  label="รหัสผ่าน"
                  onChange={handlePasswordChange}
                  icon={<IconKey />}
                  ref={passwordRef}
                />
                <Button
                  mt={"xl"}
                  type="submit"
                  w={"80%"}
                  loading={loading}
                  variant="gradient"
                  gradient={{ from: "indigo", to: "cyan" }}
                  leftIcon={<IconLogin />}
                >
                  {loading ? "กำลังเข้าสู่ระบบ" : "เข้าสู่ระบบ"}
                </Button>
              </form>
            </Container>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
