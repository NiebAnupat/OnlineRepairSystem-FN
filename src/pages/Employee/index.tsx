import React, {useEffect, useState} from "react";
import {Box, Container, Divider, Flex, Text, Title,} from "@mantine/core";
import {initialCases, useCaseStore} from "@/lib/caseStore";
import {useUserStore} from "@/lib/userStore";
import User from "@/models/User";
import Case, {LastCase, StatusID} from "@/models/Case";
import LastCaseCard from "@/components/Employee/LastCaseCard";
import PendingCard from "@/components/Employee/PendingCard";
import SimpleCaseTable from "@/components/Employee/SimpleCaseTable";

export default function Index() {

    const user: User | null = useUserStore((state) => state.user);
    const cases: Case[] | null = useCaseStore((state) => state.cases);
    const lastCase: LastCase | null = useCaseStore((state) => state.lastCase);
    // const lastCase = null;
    const showCase: Case[] | undefined = cases?.filter((c) => c.status_id !== StatusID.REPAIRED);
    const caseCount = showCase!.length | 0;


    const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString('th-TH', {
        hour: 'numeric',
        minute: 'numeric',
    }));
    useEffect(() => {
        initialCases()
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('th-TH', {
                hour: 'numeric',
                minute: 'numeric',
            }));
        }, 60000);
        return () => clearInterval(interval);


    }, []);

    return (
        <>
            <Box bg={"gray.1"} h={"100%"} pt={'xl'} sx={{userSelect: 'none'}}>
                <Container size={"90%"}>
                    <Flex justify={'space-between'} align={'baseline'}>
                        <Title order={2}>ยินดีต้อนรับ {user?.username} </Title>
                        <Text fz={'sm'}>
                            {new Date().toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                weekday: 'short',
                            })}
                            &ensp;
                            {currentTime}
                        </Text>
                    </Flex>
                    <Flex gap={'xl'} mt={'xl'}>
                        <LastCaseCard lastCase={lastCase}/>
                        <PendingCard count={caseCount}/>
                    </Flex>
                    <Divider my={'1.5rem'}/>
                    <Title order={3}>รายละเอียด</Title>
                    <SimpleCaseTable cases={showCase?.reverse()}/>
                </Container>
            </Box>
        </>
    );
}



