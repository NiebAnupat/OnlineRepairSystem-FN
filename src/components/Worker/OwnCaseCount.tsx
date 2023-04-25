import {useRouter} from "next/router";
import {Flex, Paper, Skeleton, Text, UnstyledButton} from "@mantine/core";
import React from "react";

interface props {
    ownCaseCount: number
    caseLoaded: boolean
}

export const OwnCaseCount = ({ownCaseCount,caseLoaded} : props) => {
    const router = useRouter()
    return (
        <>
            <Skeleton visible={!caseLoaded} w={'250px'} h={'200px'} radius={'lg'}>
                <UnstyledButton w={'250px'} h={'200px'} sx={{
                    textAlign: 'center',
                    "&:hover": {
                        transform: "translateY(-5px)",
                        transition: "all 0.2s ease-in-out",
                    },
                    transition: "transform 0.2s ease-in-out",
                }}
                                onClick={()=>router.push('/Worker/Tasks/Repairing')}
                >
                    <Paper p={"md"} pb={'xl'} w={'100%'} h={'100%'} radius="lg" shadow="md" sx={{
                        "&:hover": {
                            "boxShadow": "4px 12px 41px 0px rgba(50,0,150,0.1)"
                        },

                    }}>
                        <Flex gap={'xl'} h={'100%'} sx={{flexDirection: 'column'}} justify={'center'}>
                            <Text fz={24} fw={'700'}>{ownCaseCount}</Text>
                            <Text fz={'lg'}>รายการของฉัน</Text>
                        </Flex>
                        <Text fz={'xs'} c={'dimmed'}>คลิกเพื่อดู</Text>
                    </Paper>
                </UnstyledButton>
            </Skeleton>
        </>
    );
};
