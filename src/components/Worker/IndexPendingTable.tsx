import {ActionIcon, Center, Flex, Pagination, Paper, Skeleton, Table, Text, Tooltip} from "@mantine/core";
import StatusBadge from "@/components/helper/StatusBadge";
import showDetail from "@/components/Modal/detailModal";
import {IconArrowAutofitDown, IconSearch} from "@tabler/icons-react";
import React, {useEffect, useState} from "react";
import Case, {StatusID} from "@/models/Case";
import {useCaseStore} from "@/lib/caseStore";
import { usePagination} from "@mantine/hooks";
import {useUserStore} from "@/lib/userStore";
import moment from "moment";
import useAxios from "@/lib/useAxios";
import {notifications} from "@mantine/notifications";
import {modals} from "@mantine/modals";

interface props {
    isLoaded: boolean
    pendingCases: Case[]
}
export const IndexPendingTable = ({isLoaded,pendingCases}:props) => {
    const user_id = useUserStore((state) => state.user?.user_id)
    const filterCases: Case[] | null = useCaseStore((state) => state.filterCases);
    const setFilterCases = useCaseStore((state) => state.setFilterCases);

    // usePagination hook
    const pagination = usePagination({total: filterCases!.length | 0, initialPage: 1});

    // Pagination
    const [itemsPerPage, setItemsPerPage] = useState<number>(3);
    const [imageHeight, setImageHeight] = useState<number>(150);


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
        setFilterCases(pendingCases as Case[])
    }, [pendingCases])

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
            <Skeleton visible={!isLoaded} w={'100%'} h={'70vh'} radius={'lg'}>
                <Paper
                    p={'lg'}
                    radius='lg'
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
            </Skeleton>
        </>
    );
};

export default IndexPendingTable;
