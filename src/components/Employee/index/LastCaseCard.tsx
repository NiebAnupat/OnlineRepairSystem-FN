import React, {FunctionComponent} from 'react';
import {getStatusColorByID, getStatusName, LastCase} from "@/models/Case";
import {Flex, Paper, Text, Tooltip, UnstyledButton} from "@mantine/core";

interface OwnProps {
    lastCase: LastCase | null
}

type Props = OwnProps;

const LastCaseCard: FunctionComponent<Props> = (props) => {
    const {lastCase} = props;


    return (
        <Tooltip label={'สถานะของรายการแจ้งซ่อมล่าสุด'} color={'indigo.5'} position={'bottom'} withArrow
                 transitionProps={{transition: 'scale-y', duration: 300}}>
            <UnstyledButton
                w={"600px"}
                sx={{
                    "&:hover": {
                        transform: "translateY(-5px)",
                        transition: "all 0.2s ease-in-out",
                    },
                    transition: "transform 0.2s ease-in-out",
                }}
            >
                {lastCase ? (
                    <Paper p={"lg"} radius="lg" shadow="md" sx={{
                        "&:hover": {
                            "boxShadow": "4px 12px 41px 0px rgba(50,0,150,0.1)"
                        },
                    }}>
                        <Flex justify={"space-between"}>
                            <Text>สถานะการแจ้งซ่อมล่าสุด</Text>
                            <Text>รหัส: {lastCase.case_id}</Text>
                        </Flex>
                        <Text align="center" m={"lg"} fz={'lg'} fw={600}
                              c={getStatusColorByID(lastCase.status_id)}>
                            {getStatusName(lastCase.status_id)}
                        </Text>
                        <Text fz={'xs'} c="dimmed" align={'end'}>กดเพื่อดูรายละเอียด</Text>
                    </Paper>
                ) : (
                    <Paper p={"lg"} radius="lg" shadow="md" sx={{
                        "&:hover": {
                            "boxShadow": "4px 12px 41px 0px rgba(50,0,150,0.1)"
                        }
                    }}>

                        <Text align="center" m={"lg"}>
                            ไม่พบการแจ้งซ่อมล่าสุด
                        </Text>
                    </Paper>
                )}
            </UnstyledButton></Tooltip>
    )
};

export default LastCaseCard;
