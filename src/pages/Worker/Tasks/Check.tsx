import {
    ActionIcon,
    Badge,
    Box, Center,
    Container,
    Divider, Flex, Pagination,
    Paper, Skeleton,
    Space,
     Table,
    Text,
    TextInput,
    Title, Tooltip,
} from "@mantine/core";
import {IconArrowAutofitDown, IconSearch} from "@tabler/icons-react";
import React, {useEffect, useState} from "react";
import {useCaseStore} from "@/lib/caseStore";
import {useDebouncedState, usePagination} from "@mantine/hooks";
import Case, {StatusID, StatusName} from "@/models/Case";
import showDetail from "@/lib/detailModal";
import moment from "moment/moment";
import {useUserStore} from "@/lib/userStore";
import useAxios from "@/lib/useAxios";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";

export const Check = () => {
    const user_id = useUserStore((state) => state.user?.user_id)
    const pendingCases: Case[] | null = useCaseStore((state) => state.pendingCases);
    const filterCases: Case[] | null = useCaseStore((state) => state.filterCases);
    const setFilterCases = useCaseStore((state) => state.setFilterCases);

    // usePagination hook
    const pagination = usePagination({total: filterCases!.length | 0, initialPage: 1});

    // Pagination
    const [itemsPerPage, setItemsPerPage] = useState<number>(3);
    const [imageHeight, setImageHeight] = useState<number>(175);

    const [searchQuery, setSearchQuery] = useDebouncedState('', 250);

    useEffect(() => {
        const windowHeight = window.innerHeight;
        if (windowHeight < 700) {
            setItemsPerPage(4)
            setImageHeight(175)
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

    // render status chips
    const renderStatus = (statusID: number) => {
        // return Chip different color based on statusID
        switch (statusID) {
            case StatusID.PENDING:
                return (
                    <Badge color="yellow" size={'lg'}>
                        {StatusName.PENDING}
                    </Badge>
                )
            case StatusID.IN_PROGRESS :
                return (
                    <Badge color="indigo" size={'lg'}>
                        {StatusName.IN_PROGRESS}
                    </Badge>
                )
            case StatusID.REPAIRING:
                return (
                    <Badge color="blue" size={'lg'}>
                        {StatusName.REPAIRING}
                    </Badge>
                )
            default:
                return (
                    <Badge color="dimmed" size={'lg'}>
                        {StatusName.UNKNOWN}
                    </Badge>
                )

        }
    }

    const search = () => {
        const filtered: Case[] | undefined = pendingCases?.filter((c) => {
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
            setFilterCases(pendingCases as Case[])
        } else {
            search()
        }
    }, [searchQuery])

    const updateCase = async (caseID: number) => {
        const userID = user_id && user_id
        const data = {
            tec_id: userID,
            status_id: StatusID.IN_PROGRESS,
            date_assign: moment().format('YYYY-MM-DD')
        }

        const res = await useAxios.put(`cases/${caseID}/tec`, data)
        if (res.status === 200) {
            const filtered = pendingCases?.filter((c) => c.case_id !== caseID)
            setFilterCases(filtered as Case[])
            notifications.show({
                title: 'รับงานสำเร็จ',
                message: `คุณได้รับงานหมายเลข ${caseID} แล้ว`,
                color: 'teal',
            })
        }
    }

    const acceptCase = async (caseID: number) => {
        try {
            await modals.openConfirmModal({
                title: 'ยืนยันการรับงาน',
                radius: 'lg',
                padding: 'xl',
                children: (<Text>คุณต้องการรับรายงานหมายเลข {caseID} ใช่หรือไม่</Text>),
                labels: {
                    cancel: 'ยกเลิก',
                    confirm: 'ยืนยัน'
                },
                onConfirm: () => updateCase(caseID)
            })

        } catch (e) {
            notifications.show({
                title: 'รับงานไม่สำเร็จ',
                message: `เกิดข้อผิดพลาดในการรับงานหมายเลข ${caseID}`,
                color: 'red',
            })
        }
    }

    return (
        <>
            <Skeleton visible={false} w={'100%'} h={'100%'} radius={'lg'}>
                <Box bg={"gray.1"} h={"100%"} pt={'xl'}>
                    <Container size={"90%"}>
                        <Title order={2}>รายการแจ้งซ่อมใหม่</Title>
                        <Divider my={'md'}/>
                        <Container>
                            <Container size={'70%'}>
                                <TextInput placeholder={'ค้นหา...'} radius={'lg'} icon={<IconSearch/>}
                                           description={'สามารถค้นหาด้วย ชื่อ รหัส สถานะ สถานที่ ฯลฯ'}
                                           onChange={(e) => setSearchQuery(e.currentTarget.value)}
                                />
                            </Container>
                            <Space h={'md'}/>
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
                                                    <td style={{textAlign: 'center'}}>{renderStatus(item.status_id)}</td>
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
                                                            <Tooltip label={'รับการแจ้งซ่อม'} color={'green.5'}
                                                                     withArrow
                                                                     position="right"
                                                                     transitionProps={{
                                                                         transition: 'scale-x',
                                                                         duration: 300
                                                                     }}>
                                                                <ActionIcon mx={'auto'} variant="subtle" radius={'xl'}
                                                                            size={'lg'}
                                                                            color={'green.9'}
                                                                            onClick={() => acceptCase(item.case_id)}>
                                                                    <IconArrowAutofitDown size="1.125rem"/>
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
                        </Container>
                    </Container>
                </Box>
            </Skeleton>
        </>
    );
};

export default Check;
