import React, {FunctionComponent, useEffect, useState} from 'react';
import {
    ActionIcon,
    Center,
    Pagination,
    Paper,
    Skeleton,
    Table,
    Tooltip
} from '@mantine/core';
import {usePagination} from '@mantine/hooks';
import Case from "@/models/Case";
import { IconSearch} from "@tabler/icons-react";
import showDetail from "@/components/Modal/detailModal";
import StatusBadge from "@/components/helper/StatusBadge";

interface OwnProps {
    cases: Case[] | undefined
    caseLoaded: boolean
}

type Props = OwnProps;

const SimpleCaseTable: FunctionComponent<Props> = (props) => {

    // usePagination hook
    const pagination = usePagination({total: props.cases!.length | 0, initialPage: 1});

    // Pagination
    const [itemsPerPage, setItemsPerPage] = useState<number>(3);
    const [imageHeight, setImageHeight] = useState<number>(175);

    useEffect(() => {
        const windowHeight = window.innerHeight;
        if (windowHeight < 720) {
            setItemsPerPage(3)
            setImageHeight(175)
        } else if (windowHeight < 800) {
            setItemsPerPage(4)
            setImageHeight(200)
        } else if (windowHeight < 900) {
            setItemsPerPage(5)
            setImageHeight(225)
        } else {
            setItemsPerPage(6)
            setImageHeight(350)
        }

    }, [])



    return (
        <>
            <Skeleton visible={!props.caseLoaded} w={'100%'} h={'100%'} radius={'lg'}>
                <Tooltip label={'รายละเอียดคร่าว ๆ'} color={'indigo.5'} position={'top'} withArrow offset={15}
                         transitionProps={{transition: 'slide-up', duration: 300}}>
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
                                props.cases!.slice((pagination.active - 1) * itemsPerPage, pagination.active * itemsPerPage).map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td style={{textAlign: 'center'}}>{item.case_id}</td>
                                            <td style={{textAlign: 'left'}}>{item.name_case}</td>
                                            <td style={{textAlign: 'center'}}>{new Date(item.date_case).toLocaleDateString('th-TH')}</td>
                                            <td style={{textAlign: 'center'}}>{<StatusBadge status_id={item.status_id}/>}</td>
                                            <td style={{textAlign: 'center'}}>
                                                <Tooltip label={'ดูรายละเอียด'} color={'violet.4'} withArrow
                                                         position="right"
                                                         transitionProps={{transition: 'scale-x', duration: 300}}>
                                                    <ActionIcon mx={'auto'} variant="subtle" radius={'xl'} size={'lg'}
                                                                color={'indigo.9'} onClick={()=>showDetail(item.case_id,imageHeight)}>
                                                        <IconSearch size="1.125rem"/>
                                                    </ActionIcon>
                                                </Tooltip>
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
                                total={Math.ceil(props.cases!.length / itemsPerPage)}
                                value={pagination.active}
                                withEdges
                                onChange={pagination.setPage}
                            />
                        </Center>
                    </Paper>
                </Tooltip>
            </Skeleton>
        </>
    );
};

export default SimpleCaseTable;
