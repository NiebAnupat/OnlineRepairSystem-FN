import React, {FunctionComponent} from 'react';
import {Flex, Paper, Text} from "@mantine/core";

interface OwnProps {
    count: number
}

type Props = OwnProps;

const PendingCard: FunctionComponent<Props> = (props) => {

    return (
        <>
            <Paper p={"lg"} radius="lg" shadow="md" sx={{
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
        </>
    );
};

export default PendingCard;
