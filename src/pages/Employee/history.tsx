import {Box, Center, Container, Divider, SimpleGrid, Space, Text, TextInput, Title} from "@mantine/core";
import React from "react";
import Case from "@/models/Case";
import {useCaseStore} from "@/lib/caseStore";
import HistoryCard from "@/components/Employee/history/HistoryCard";
import {IconSearch} from "@tabler/icons-react";

export default function History() {
    const cases: Case[] | null = useCaseStore((state) => state.cases);
    // const cases: Case[] | null = []
    return <>
        <Box bg={"gray.1"} h={"100%"} pt={'xl'} sx={{userSelect: 'none'}}>
            <Container size={"90%"} pb={'xl'}>
                <Title order={2}>ประวัติการแจ้งซ่อม</Title>
                <Space h={'xl'}/>
                <TextInput placeholder={'ค้นหา...'} radius={'lg'} icon={<IconSearch/>}
                           description={'สามารถค้นหาด้วย ชื่อ รหัส สถานะ สถานที่ วันที่ ฯลฯ'}/>
                <Divider my={'xl'}/>
                <Space h={'md'}/>


                {cases && cases?.length > 0 ?
                    <Box>
                        <Text c={'dimmed'} fz={'xs'} mt={'-xl'} mb={'md'}>เลือกเพื่อดูรายละเอียด</Text>
                        <SimpleGrid cols={3} spacing={'xl'}>
                            {cases?.map((c) => (
                                <HistoryCard key={c.case_id} case={c}/>
                            ))}
                        </SimpleGrid>
                    </Box>
                    :
                    <Center h={'60vh'}><Text align={'center'} c={'dimmed'}
                                             size={'xl'}>ไม่พบประวัติการแจ้งซ่อม</Text></Center>}

            </Container>
        </Box>
    </>;
}
