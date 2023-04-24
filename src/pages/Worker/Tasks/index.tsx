import {Box, Container, Divider, Paper, Stack, Text, ThemeIcon, Title, UnstyledButton} from "@mantine/core";
import React from "react";
import {IconArrowAutofitDown} from "@tabler/icons-react";

export default function Index() {
    return (
        <>
            <Box bg={"gray.1"} h={"100%"} pt={'xl'}>
                <Container size={"90%"}>
                    <Title order={2}>งานแจ้งซ่อม</Title>
                    <Divider my={'md'}/>
                    <Container>
                        <UnstyledButton  sx={{
                            "&:hover": {
                                transform: "translateY(-5px)",
                                transition: "all 0.2s ease-in-out",
                            },
                            transition: "transform 0.2s ease-in-out",
                        }}>
                            <Paper shadow={'sm'} p={'md'} radius={'md'} bg={'white'}>
                                <Stack spacing={'md'} align={'center'}>
                                    <ThemeIcon variant={'light'} size={'xl'}>
                                        <IconArrowAutofitDown/>
                                    </ThemeIcon>
                                    <Text>ตรวจสอบรายงาน</Text>
                                </Stack>
                            </Paper>
                        </UnstyledButton>

                    </Container>
                </Container>
            </Box>
        </>
    );
}
