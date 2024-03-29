import React, {FunctionComponent} from 'react';
import {Flex, Paper, Skeleton, Text, Tooltip} from "@mantine/core";

interface OwnProps {
    count: number
    caseLoaded: boolean
}

type Props = OwnProps;

const PendingCard: FunctionComponent<Props> = (props) => {

    return (
        <>
            <Skeleton visible={!props.caseLoaded} w={"600px"} h={'150px'} radius={'lg'}>
            <Tooltip label={'จำนวนรายการที่อยู่ระหว่างดำเนินการ'} color={'indigo.5'} position={'bottom'} withArrow
                     transitionProps={{transition: 'scale-y', duration: 300}}>
                <Paper p={"lg"} radius="lg" shadow="md"  h={'150px'} sx={{
                    flexGrow: 1,
                    "&:hover": {
                        "boxShadow": "4px 12px 41px 0px rgba(50,0,150,0.1)"
                    }
                }}>
                    <Text>รายการทั้งหมดในขณะนี้</Text>
                    <Flex justify={"space-between"} align={'center'} h={'100%'} mt={'-sm'}>
                        <Text>จำนวน</Text>
                        <Text>{props.count}</Text>
                        <Text>รายการ</Text>
                    </Flex>
                </Paper>
            </Tooltip>
            </Skeleton>
        </>
    );
};

export default PendingCard;
