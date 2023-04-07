import React from "react";
import {
  Container,
  Paper,
  Text,
  Box,
  Flex,
  UnstyledButton,
} from "@mantine/core";

export default function Index() {

  return (
    <>
      <Box bg={"gray.1"} h={"100%"}>
        <Container size={"95%"}>
          <Flex>
            <UnstyledButton
              mt={"xl"}
              w={"500px"}
              sx={{
                "&:hover": {
                  transform: "translateY(-5px)",
                  transition: "all 0.2s ease-in-out",
                },
                transition: "transform 0.2s ease-in-out",
              }}
            >
              <Paper p={"lg"} radius="lg" shadow="md" sx={{
                "&:hover": {
                  "boxShadow": "4px 12px 41px 0px rgba(50,0,150,0.1)"
                }
              }}>
                <Flex justify={"space-between"}>
                  <Text>สถานนะการแจ้งซ่อมล่าสุด</Text>
                  <Text>รหัส: 123456789</Text>
                </Flex>
                <Text align="center" m={"lg"}>
                  รอการตรวจสอบ
                </Text>
              </Paper>
            </UnstyledButton>
          </Flex>
        </Container>
      </Box>
    </>
  );
}
