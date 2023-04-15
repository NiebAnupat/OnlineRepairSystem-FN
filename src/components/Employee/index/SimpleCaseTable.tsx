import React, {FunctionComponent} from 'react';
import {ActionIcon, Badge, Center, Pagination, Paper, Table, Tooltip} from '@mantine/core';
import {usePagination} from '@mantine/hooks';
import Case, {StatusID, StatusName} from "@/models/Case";
import {IconSearch} from "@tabler/icons-react";

interface OwnProps {
    cases: Case[] | undefined
}

type Props = OwnProps;

const SimpleCaseTable: FunctionComponent<Props> = (props) => {

    // usePagination hook
    const pagination = usePagination({total: props.cases!.length | 0, initialPage: 1});

    // Pagination
    const itemsPerPage = 5;

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


    return (
        <>
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
                            props.cases?.map((item) => (
                                <tr key={item.case_id}>
                                    <td style={{textAlign: 'center'}}>{item.case_id}</td>
                                    <td style={{textAlign: 'left'}}>{item.name_case}</td>
                                    <td style={{textAlign: 'center'}}>{new Date(item.date_case).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: 'numeric',
                                    })}</td>
                                    <td style={{textAlign: 'center'}}>{renderStatus(item.status_id)}</td>
                                    <td style={{textAlign: 'center'}}>
                                        <Tooltip label={'ดูรายละเอียด'} color={'violet.4'} withArrow position="right"
                                                 transitionProps={{transition: 'scale-x', duration: 300}}>
                                            <ActionIcon mx={'auto'} variant="subtle" radius={'xl'} size={'lg'}
                                                        color={'indigo.9'}>
                                                <IconSearch size="1.125rem"/>
                                            </ActionIcon>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>

                    </Table>
                    <Center>
                        <Pagination
                            style={{marginTop: '16px'}}
                            total={Math.ceil(props.cases!.length / itemsPerPage)}
                            value={pagination.active}
                            onChange={pagination.setPage}
                        />
                    </Center>
                </Paper>
            </Tooltip>
        </>
    );
};

export default SimpleCaseTable;
