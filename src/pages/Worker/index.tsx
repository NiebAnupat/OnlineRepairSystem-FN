import React, {useEffect, useState} from "react";
import {Box, Container, Flex, Text, Title} from '@mantine/core';
import {useUserStore} from "@/lib/userStore";
import {useInterval} from "@mantine/hooks";

export default function Index() {
    const username = useUserStore(state => state.user?.username)

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
            </Container>
        </Box>
    </>;
}
