import {
    ActionIcon,
    Box, Center,
    Container,
    Divider,
    Flex, Pagination,
    Paper,
    Skeleton,
    Space,
    Table,
    TextInput,
    Title,
    Tooltip
} from "@mantine/core";
import React, {useEffect, useState} from "react";
import { useCaseStore} from "@/lib/caseStore";
import {useDebouncedState, usePagination} from "@mantine/hooks";
import Case from "@/models/Case";
import moment from "moment/moment";
import { IconEditCircle, IconSearch} from "@tabler/icons-react";
import showDetail from "@/components/Modal/detailModal";
import {modals} from "@mantine/modals";
import UpdateCaseStatus from "@/components/Modal/UpdateCaseStatus";
import StatusBadge from "@/components/helper/StatusBadge";
import {useUserStore} from "@/lib/userStore";

export const Repairing = () => {

    const user_id = useUserStore((state) => state.user?.user_id);

    const isLoaded = useCaseStore((state) => state.isLoaded);
    const processCases = useCaseStore((state) => state.processCases);
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
        setFilterCases(processCases as Case[])
    }, [processCases])

    const search = () => {
        const filtered: Case[] | undefined = processCases?.filter((c) => {
            const formattedDate = moment(c.date_case).format('YYYY-MM-DD');
            return c.case_id == Number(searchQuery) || c.name_case.includes(searchQuery) || c.detail_case.includes(searchQuery) || c.status_id.toString().includes(searchQuery) || c.statuses.status_name.includes(searchQuery) || c.place_case.includes(searchQuery) || formattedDate.includes(searchQuery)
        })
        if (filtered?.length === 0) {
            return setFilterCases([])
        }
        return setFilterCases(filtered as Case[])
    }

    useEffect(() => {
        if (searchQuery === '' || searchQuery === undefined) {
            setFilterCases(processCases as Case[])
        } else {
            search()
        }
    }, [searchQuery])

    const updateCaseStatus = (selectedCase: Case) => {
        modals.open({
            title: 'เปลี่ยนสถานะรายการ',
            padding: 'xl',
            size: 'lg',
            radius: 'lg',
            children: (<UpdateCaseStatus selectedCase={selectedCase} user_id={user_id ? user_id : ''}/>)
        })
    }

    return (
        <>
            <Box bg={"gray.1"} h={"100%"} pt={'xl'}>
                <Container size={"90%"}>
                    <Title order={2}>งานที่กำลังดำเนินการ</Title>
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
                                        filterCases!.length > 0 ? filterCases!.slice().reverse().slice((pagination.active - 1) * itemsPerPage, pagination.active * itemsPerPage).map((item, index) => {
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
                                                            <Tooltip label={'แก้ไขสถานะ'} color={'green.5'}
                                                                     withArrow
                                                                     position="right"
                                                                     transitionProps={{
                                                                         transition: 'scale-x',
                                                                         duration: 300
                                                                     }}>
                                                                <ActionIcon mx={'auto'} variant="subtle" radius={'xl'}
                                                                            size={'lg'}
                                                                            color={'green.9'}
                                                                            onClick={() => updateCaseStatus(item)}
                                                                >
                                                                    <IconEditCircle size="1.125rem"/>
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Flex>
                                                    </td>
                                                </tr>
                                            )
                                        }) :
                                            <tr>
                                                <td colSpan={5} style={{textAlign: 'center'}}>ไม่พบข้อมูล</td>
                                            </tr>
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

export default Repairing;
