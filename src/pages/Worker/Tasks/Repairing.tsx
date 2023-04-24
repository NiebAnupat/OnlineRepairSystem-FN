import {Box, Container, Divider, Title} from "@mantine/core";
import React from "react";

export const Repairing = () => {
    return (
        <>
            <Box bg={"gray.1"} h={"100%"} pt={'xl'}>
                <Container size={"90%"}>
                    <Title order={2}>งานที่กำลังดำเนินการ</Title>
                    <Divider my={'md'}/>
                    <Container>


                    </Container>
                </Container>
            </Box>
        </>
    );
};

export default Repairing;
