import {
    ActionIcon,
    Box,
    Center,
    Container,
    Divider, Flex,
    Pagination,
    Paper,
    Skeleton,
    Space,
    Table,
    TextInput,
    Title, Tooltip
} from "@mantine/core";
import React, {useEffect, useState} from "react";
import { IconSearch} from "@tabler/icons-react";
import {useCaseStore} from "@/lib/caseStore";
import Case from "@/models/Case";
import {useDebouncedState, usePagination} from "@mantine/hooks";
import showDetail from "@/lib/detailModal";
import moment from "moment";
import StatusBadge from "@/components/helper/StatusBadge";

export const History = () => {
    const isLoaded = useCaseStore((state) => state.isLoaded);
    const ownCases = useCaseStore((state) => state.cases);
    const filterCases = useCaseStore((state) => state.filterCases);
    const setFilterCases = useCaseStore((state) => state.setFilterCases);

    // usePagination hook
    const pagination = usePagination({total: filterCases!.length | 0, initialPage: 1});

    // Pagination
    const [itemsPerPage, setItemsPerPage] = useState<number>(3);
    const [imageHeight, setImageHeight] = useState<number>(150);

    const [searchQuery, setSearchQuery] = useDebouncedState('', 250);

    useEffect(() => {
        const windowHeight = window.innerHeight;
        if (windowHeight < 700) {
            setItemsPerPage(4)
            setImageHeight(150)
        } else if (windowHeight < 800) {
            setItemsPerPage(5)
            setImageHeight(200)
        } else if (windowHeight < 900) {
            setItemsPerPage(6)
            setImageHeight(225)
        } else {
            setItemsPerPage(8)
            setImageHeight(350)
        }
    }, [])

    useEffect(() => {
        setFilterCases(ownCases as Case[])
    }, [ownCases])

    const search = () => {
        const filtered: Case[] | undefined = ownCases?.filter((c) => {
            const formattedDate = moment(c.date_case).format('YYYY-MM-DD');
            return c.case_id == Number(searchQuery) || c.name_case.includes(searchQuery) || c.detail_case.includes(searchQuery) || c.status_id.toString().includes(searchQuery) || c.place_case.includes(searchQuery) || formattedDate.includes(searchQuery)
        })
        if (filtered?.length === 0) {
            return setFilterCases([])
        }
        return setFilterCases(filtered as Case[])
    }

    useEffect(() => {
        if (searchQuery === '' || searchQuery === undefined) {
            setFilterCases(ownCases as Case[])
        } else {
            search()
        }
    }, [searchQuery])


    return (
        <>
            <Box bg={"gray.1"} h={"100%"} pt={'xl'}>
                <Container size={"90%"}>
                    <Title order={2}>ประวัติการซ่อม</Title>
                    <Divider my={'md'}/>
                    <Container>

                        <Container size={'70%'}>
                            <TextInput placeholder={'ค้นหา...'} radius={'lg'} icon={<IconSearch/>}
                                       description={'สามารถค้นหาด้วย ชื่อ รหัส สถานะ สถานที่ ฯลฯ'}
                                       onChange={(e) => setSearchQuery(e.currentTarget.value)}
                            />
                        </Container>
                        <Space h={'md'}/>
                        <Skeleton visible={!isLoaded} w={'100%'} h={'70vh'} radius={'lg'}>
                            <Paper
                                p={'lg'}
                                radius='lg'
                                mt={'md'}
                                shadow='md'
                                sx={{
                                    '&:hover': {
                                        boxShadow: '4px 12px 41px 0px rgba(50,0,150,0.1)',
                                    },
                                }}
                            >
                                <Table verticalSpacing={'md'}>
                                    <thead>
                                    <tr>
                                        <th style={{width: '10%', textAlign: 'center'}}>รหัส</th>
                                        <th style={{textAlign: 'center', width: '40%'}}>หัวข้อ</th>
                                        <th style={{textAlign: 'center', width: '15%'}}>วันที่</th>
                                        <th style={{textAlign: 'center', width: '15%'}}>สถานะ</th>
                                        <th style={{textAlign: 'center'}}>ดำเนินการ</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        filterCases?.slice().reverse().slice((pagination.active - 1) * itemsPerPage, pagination.active * itemsPerPage).map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td style={{textAlign: 'center'}}>{item.case_id}</td>
                                                    <td style={{textAlign: 'left'}}>{item.name_case}</td>
                                                    <td style={{textAlign: 'center'}}>{new Date(item.date_case).toLocaleDateString('th-TH')}</td>
                                                    <td style={{textAlign: 'center'}}>{<StatusBadge
                                                        status_id={item.status_id}/>}</td>
                                                    <td style={{textAlign: 'center'}}>
                                                        <Flex px={'xl'} justify={'space-around'}>
                                                            <Tooltip label={'ดูรายละเอียด'} color={'violet.4'} withArrow
                                                                     position="right"
                                                                     transitionProps={{
                                                                         transition: 'scale-x',
                                                                         duration: 300
                                                                     }}>
                                                                <ActionIcon mx={'auto'} variant="subtle" radius={'xl'}
                                                                            size={'lg'}
                                                                            color={'indigo.9'}
                                                                            onClick={() => showDetail(item.case_id, imageHeight)}>
                                                                    <IconSearch size="1.125rem"/>
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Flex>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    </tbody>
                                </Table>
                                <Center>
                                    <Pagination
                                        style={{marginTop: '16px'}}
                                        total={Math.ceil(filterCases!.length / itemsPerPage)}
                                        value={pagination.active}
                                        withEdges
                                        onChange={pagination.setPage}
                                    />
                                </Center>
                            </Paper>
                        </Skeleton>

                    </Container>
                </Container>
            </Box>
        </>
    );
};

export default History;
