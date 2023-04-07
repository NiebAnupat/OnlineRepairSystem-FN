import React, {useEffect} from "react";
import {Box, Container, Flex, Text,} from "@mantine/core";
import {initialCases, useCaseStore} from "@/lib/caseStore";
import {useUserStore} from "@/lib/userStore";
import User from "@/models/User";
import {LastCase} from "@/models/Case";
import LastCaseCard from "@/components/Employee/LastCaseCard";

export default function Index() {

    const user: User | null = useUserStore((state) => state.user);
    // const cases: Case[] | null = useCaseStore((state) => state.cases);
    const lastCase: LastCase | null = useCaseStore((state) => state.lastCase);
    // const lastCase = null;
    useEffect(() => {
        initialCases()
    }, []);


    return (
        <>
            <Box bg={"gray.1"} h={"100%"}>
                <Container size={"95%"} mt={'xl'}>
                    <Text size={'xl'}>สวัสดีคุณ {user?.username}</Text>
                    <Flex>
                        <LastCaseCard lastCase={lastCase}/>
                    </Flex>
                </Container>
            </Box>
        </>
    );
}



