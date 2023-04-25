import React, {useEffect, useState} from "react";
import {Box, Container, Flex, Space, Text, Title, Tooltip} from '@mantine/core';
import {useUserStore} from "@/lib/userStore";
import {useInterval} from "@mantine/hooks";
import PendingCaseCount from "@/components/Worker/PendingCaseCount";
import {useCaseStore} from "@/lib/caseStore";
import {OwnCaseCount} from "@/components/Worker/OwnCaseCount";
import {IndexPendingTable} from "@/components/Worker/IndexPendingTable";
import Case from "@/models/Case";

export default function Index() {
    const username = useUserStore(state => state.user?.username)
    const caseLoaded = useCaseStore(state => state.isLoaded)
    const pendingCases = useCaseStore(state => state.pendingCases)
    const ownCases = useCaseStore(state => state.processCases)

    const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString('th-TH', {
        hour: 'numeric',
        minute: 'numeric',
    }));
    const setCurrentTimeInterval = useInterval(() => {
        setCurrentTime(new Date().toLocaleTimeString('th-TH', {
            hour: 'numeric',
            minute: 'numeric',
        }));
    }, 1000 * 60);

    useEffect(() => {
        setCurrentTime(new Date().toLocaleTimeString('th-TH', {
            hour: 'numeric',
            minute: 'numeric',
        }));
        setCurrentTimeInterval.start();
        return () => {
            setCurrentTimeInterval.stop();
        }


    }, []);
    return <>
        <Box bg={"gray.1"} h={"100%"} pt={'xl'}>
            <Container size={"90%"}>
                <Flex justify={'space-between'} align={'baseline'}>
                    <Title order={2}>ยินดีต้อนรับ {username} </Title>
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

                <Space h={'xl'}/>

                <Container display={'flex'} sx={{gap:50}} mt={'xl'}>
                    <Flex gap={'xl'} direction={'column'}>
                        <PendingCaseCount pendingCaseCount={pendingCases?.length || 0} caseLoaded={caseLoaded}/>
                        <Space h={'md'}/>
                        <OwnCaseCount ownCaseCount={ownCases?.length || 0} caseLoaded={caseLoaded}/>
                    </Flex>
                    <Tooltip label={'ตารางรายการคงค้าง'} color={'indigo.5'} position={'top'} withArrow
                             transitionProps={{transition: 'slide-up', duration: 300}}>
                        <Box sx={{flexGrow: 1}}>
                        <IndexPendingTable isLoaded={caseLoaded} pendingCases={pendingCases as Case[]}/>
                    </Box>
                    </Tooltip>
                </Container>

            </Container>
        </Box>
    </>;
}
