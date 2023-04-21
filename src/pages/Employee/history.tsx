import {Box, Center, Container, Divider, Pagination, SimpleGrid, Space, Text, TextInput, Title} from "@mantine/core";
import {useDebouncedState, usePagination} from '@mantine/hooks';
import React, {useEffect, useState} from "react";
import Case from "@/models/Case";
import {useCaseStore} from "@/lib/caseStore";
import HistoryCard from "@/components/Employee/history/HistoryCard";
import {IconSearch} from "@tabler/icons-react";
import moment from "moment";

export default function History() {
    const cases: Case[] | null = useCaseStore((state) => state.cases);
    const filterCases: Case[] | null = useCaseStore((state) => state.filterCases);
    const setFilterCases = useCaseStore((state) => state.setFilterCases);
    // const cases: Case[] | null = []
    const pagination = usePagination({total: cases!.length | 0, initialPage: 1});
    // Pagination
    const [itemsPerPage, setItemsPerPage] = useState<number>(6);

    useEffect(() => {
        const windowHeight = window.innerHeight;
        if (windowHeight < 720) {
            setItemsPerPage(6)
        } else if (windowHeight < 900) {
            setItemsPerPage(9)
        } else {
            setItemsPerPage(12)
        }

    }, [])

    const [searchQuery, setSearchQuery] = useDebouncedState('', 250);
    const search = () => {
        const filtered: Case[] | undefined = cases?.filter((c) => {
            const formattedDate = moment(c.date_case).format('YYYY-MM-DD');
            return c.case_id == Number(searchQuery) || c.name_case.includes(searchQuery)|| c.detail_case.includes(searchQuery) || c.status_id.toString().includes(searchQuery) || c.place_case.includes(searchQuery) || formattedDate.includes(searchQuery)
        })
        if (filtered?.length === 0) {
            return setFilterCases([])
        }
        return setFilterCases(filtered as Case[])
    }

    useEffect(() => {
        if (searchQuery === '' || searchQuery === undefined) {
            setFilterCases(cases as Case[])
        } else {
            search()
        }
    }, [searchQuery])

    return <>
        <Box bg={"gray.1"} h={"100%"} pt={'xl'} sx={{userSelect: 'none'}}>
            <Container size={"90%"} pb={'xl'}>
                <Title order={2}>ประวัติการแจ้งซ่อม</Title>
                <Space h={'xl'}/>
                <Container>
                    <TextInput placeholder={'ค้นหา...'} radius={'lg'} icon={<IconSearch/>}
                               description={'สามารถค้นหาด้วย ชื่อ รหัส สถานะ สถานที่ วันที่ ฯลฯ'}
                               onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    />
                </Container>
                <Divider my={'xl'}/>
                <Space h={'md'}/>


                {filterCases && filterCases?.length > 0 ?
                    <Box>
                        <Text c={'dimmed'} fz={'xs'} mt={'-xl'} mb={'xs'}>เลือกเพื่อดูรายละเอียด</Text>
                        <SimpleGrid cols={3} spacing={'xl'}>
                            {filterCases
                                ?.slice()
                                .reverse()
                                .slice((pagination.active - 1) * itemsPerPage, pagination.active * itemsPerPage)
                                .map((c, i) => {
                                    return <HistoryCard key={i} case={c}/>;
                                })}
                        </SimpleGrid>
                        <Center>
                            <Pagination
                                style={{marginTop: '16px'}}
                                total={Math.ceil(filterCases!.length / itemsPerPage)}
                                value={pagination.active}
                                onChange={pagination.setPage}
                                withEdges
                            />
                        </Center>
                    </Box>
                    :
                    <Center h={'60vh'}><Text align={'center'} c={'dimmed'}
                                             size={'xl'}>ไม่พบประวัติการแจ้งซ่อม</Text></Center>}

            </Container>
        </Box>
    </>;
}
