import React, {FunctionComponent} from 'react';
import {LastCase} from "@/models/Case";
import {Flex, Paper, Text, UnstyledButton} from "@mantine/core";

interface OwnProps {
    lastCase: LastCase | null
}

type Props = OwnProps;

const LastCaseCard: FunctionComponent<Props> = (props) => {
    const {lastCase} = props;
    if (lastCase) {
        return (
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
                        <Text>รหัส: {lastCase.case_id}</Text>
                    </Flex>
                    <Text align="center" m={"lg"}>
                        รอการตรวจสอบ {lastCase.status_id}
                    </Text>
                </Paper>
            </UnstyledButton>
        )
    } else {
        return (
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

                    <Text align="center" m={"lg"}>
                        ไม่พบการแจ้งซ่อมล่าสุด
                    </Text>
                </Paper>
            </UnstyledButton>

        )
    }
};

export default LastCaseCard;
