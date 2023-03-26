import React, { useState } from "react";
import { TextInput, Button, Container, Text, Box } from "@mantine/core";
import { h } from "next";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add your authentication logic here
  };

  return (
    <>
      <Box h={"100vh"} p={"xl"}>
        <Container h={"100%"} size={"xl"}>
          <Box
            bg={"indigo.5"}
            h={"100%"}
            sx={{
              borderRadius: "20px",
            }}
          >
            <Container
              h={"100%"}
              display={"flex"}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
              size={"80%"}
            >
              <Box
                bg={"indigo.3"}
                mr={"lg"}
                h={"90%"}
                sx={{
                  flexGrow: 1,
                  borderRadius: "20px",
                }}
              >
                <Text
                  fz={"xl"}
                  fw={800}
                  color="dark.9"
                  align="center"
                  mt={"xl"}
                >
                  ระบบแจ้งซ่อมออนไลน์
                </Text>
              </Box>
              <Box w={"40%"} pl={"5%"}>
                <Text
                  align="center"
                  mb={"xl"}
                  fz={40}
                  fw={800}
                  c={"white"}
                  mt={"-10%"}
                >
                  เข้าสู่ระบบ
                </Text>
                <form onSubmit={handleSignIn}>
                  <TextInput
                    label="รหัสพนักงาน"
                    labelProps={{ c: "white" }}
                    placeholder="รหัสพนักงาน"
                    value={email}
                    variant="filled"
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <TextInput
                    mt={10}
                    label="รหัสผ่าน"
                    labelProps={{ c: "white" }}
                    placeholder="ชรหัสผ่าน"
                    type="password"
                    value={password}
                    variant="filled"
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <Button
                    mt={15}
                    sx={{
                      marginLeft: "auto",
                      marginRight: "auto",
                      display: "block",
                    }}
                    type="submit"
                  >
                    เข้าสู่ระบบ
                  </Button>
                </form>
              </Box>
            </Container>
          </Box>
        </Container>
      </Box>
    </>
  );
}
