import React, {FunctionComponent, useEffect, useState} from 'react';
import {
    ActionIcon,
    Badge,
    Box,
    Center,
    Flex, Grid, Image,
    Pagination,
    Paper,
    Skeleton, Space,
    Table, Text, Textarea,
    Timeline,
    Tooltip
} from '@mantine/core';
import {usePagination} from '@mantine/hooks';
import Case, {StatusID, StatusName} from "@/models/Case";
import {IconCircleCheckFilled, IconClockPause, IconLoader3, IconSearch, IconTools} from "@tabler/icons-react";
import useAxios from "@/lib/useAxios";
import {modals} from "@mantine/modals";
import {Carousel} from "@mantine/carousel";
import {BufferToBase64} from "@/lib/helper";
import {notifications} from "@mantine/notifications";

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
    const [imageHeight, setImageHeight] = useState<number>();

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

    const showDetail = async (case_id: number) => {
        try {
            const res = await useAxios.get(`cases/${case_id}`)
            if (res.status === 200) {
                const cse: Case = res.data
                modals.open({
                    title: `รายละเอียดของ ${cse.name_case}`,
                    size: '90%',
                    padding: 'lg',
                    radius: 'lg',
                    shadow: 'md',
                    children: (
                        <Box>
                            <Flex gap={'xl'}>
                                <Timeline active={cse.status_id - 1} color="violet" bulletSize={30} lineWidth={4}
                                          sx={{flexGrow: 1}}>
                                    <Timeline.Item title={StatusName.PENDING} bullet={<IconClockPause size={20}/>}>
                                        <Text color="dimmed" size="sm">
                                            รายการแจ้งซ่อมนี้ได้ถูกส่งเข้าระบบแล้ว
                                        </Text>
                                        <Text mt={3}
                                              size="xs">วันที่ {new Date(cse.date_case).toLocaleDateString('th-TH')}</Text>
                                        <Space h="xl"/>
                                    </Timeline.Item>

                                    <Timeline.Item title={StatusName.IN_PROGRESS} bullet={<IconLoader3 size={20}/>}>
                                        <Text color="dimmed" size="sm">
                                            เจ้าหน้าที่ได้รับคำขอแจ้งซ่อมแล้ว
                                        </Text>
                                        {cse.date_assign && (<Text mt={3}
                                                                   size="xs">วันที่ {new Date(cse.date_assign).toLocaleDateString('th-TH')}</Text>)}
                                        <Space h="xl"/>
                                    </Timeline.Item>

                                    <Timeline.Item title={StatusName.REPAIRING} bullet={<IconTools size={20}/>}
                                                   lineVariant="dashed">
                                        <Text color="dimmed" size="sm">
                                            เจ้าหน้าที่กำลังดำเนินการซ่อม
                                        </Text>
                                        {cse.date_sent && (
                                            <Text mt={3}
                                                  size="xs">วันที่ {new Date(cse.date_sent).toLocaleDateString('th-TH')}</Text>)}
                                        <Space h="xl"/>
                                    </Timeline.Item>

                                    <Timeline.Item title={StatusName.REPAIRED}
                                                   bullet={<IconCircleCheckFilled size={20}/>}>
                                        <Text color="dimmed" size="sm">
                                            เจ้าหน้าที่ได้ดำเนินการซ่อมเสร็จสิ้นแล้ว
                                        </Text>
                                        {cse.date_close && (<Text mt={3}
                                                                  size="xs">วันที่ {new Date(cse.date_close).toLocaleDateString('th-TH')}</Text>)}
                                        <Space h="xl"/>
                                    </Timeline.Item>
                                </Timeline>

                                <Box ml={'xl'} w={'70%'}>
                                    <Grid gutter={'xl'} w={'100%'} h={'100%'}>
                                        <Grid.Col span={6}>
                                            <Text size="md" weight={600}>
                                                รหัสรายการ
                                            </Text>
                                            <Text size='sm' ml={'md'} color="dimmed">
                                                {cse.case_id}
                                            </Text>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Text size="md" weight={600}>
                                                สถานที่
                                            </Text>
                                            <Text size='sm' ml={'md'} color="dimmed">
                                                {cse.place_case}
                                            </Text>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Text size="md" weight={600}>
                                                ชื่อผู้แจ้ง
                                            </Text>
                                            <Text size='sm' ml={'md'} color="dimmed">
                                                {cse.users_cases_user_idTousers.username}
                                            </Text>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Text size="md" weight={600}>
                                                ช่างซ่อม
                                            </Text>
                                            <Text size='sm' ml={'md'} color="dimmed">
                                                {cse.tec_id ? cse.users_cases_tec_idTousers?.username : 'รอการตรวจสอบ'}
                                            </Text>
                                        </Grid.Col>
                                        <Grid.Col span={12}>
                                            <Textarea
                                                value={cse.detail_case}
                                                readOnly
                                                rows={5}
                                                maxRows={5}
                                                label="รายละเอียดการแจ้งซ่อม"
                                                labelProps={{
                                                    style: {
                                                        fontSize: '1rem',
                                                        fontWeight: 600,
                                                    }
                                                }}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={12}>
                                            <Flex align={'baseline'}>
                                                <Text size={'md'} weight={600}>
                                                    ตัวอย่างรูปภาพ
                                                </Text>
                                                <Text size={'xs'} color={'dimmed'} ml={'md'}>
                                                    สามารถกดเพื่อดูรูปภาพที่ใหญ่ขึ้นได้
                                                </Text>
                                            </Flex>
                                            <Space h={'md'}/>
                                            <Carousel slideSize="50%" height={imageHeight} slideGap="md"
                                                      controlsOffset="md"
                                                      loop withIndicators>
                                                {cse.images.map((image, index) => (
                                                    <Carousel.Slide key={index}>
                                                        <Image src={image && BufferToBase64(image.image) || ''}
                                                               withPlaceholder
                                                               alt="Image" sx={{
                                                            cursor: 'pointer',
                                                        }} onClick={() => {
                                                            modals.open({
                                                                title: 'รูปภาพ',
                                                                padding: 'xl',
                                                                size: '75%',
                                                                radius: 'lg',
                                                                shadow: 'md',
                                                                children: (
                                                                    <Image
                                                                        src={image && BufferToBase64(image.image) || ''}
                                                                        withPlaceholder alt="Image"/>
                                                                ),

                                                            })
                                                        }}/>
                                                    </Carousel.Slide>
                                                ))}
                                            </Carousel>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Flex>
                        </Box>
                    ),
                    styles: {
                        title: {
                            fontSize: '1.5rem',
                            fontWeight: 600,
                        }
                        ,
                        body: {
                            padding: '4rem',
                            marginTop: '2rem',
                        }
                        ,
                    }
                })
                ;
            }
        } catch (e) {
            notifications.show({
                title: 'ไม่พบข้อมูล',
                message: 'ไม่พบข้อมูลรายการแจ้งซ่อม',
                color: 'red',
            })
        }
    }


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
                                            <td style={{textAlign: 'center'}}>{renderStatus(item.status_id)}</td>
                                            <td style={{textAlign: 'center'}}>
                                                <Tooltip label={'ดูรายละเอียด'} color={'violet.4'} withArrow
                                                         position="right"
                                                         transitionProps={{transition: 'scale-x', duration: 300}}>
                                                    <ActionIcon mx={'auto'} variant="subtle" radius={'xl'} size={'lg'}
                                                                color={'indigo.9'} onClick={()=>showDetail(item.case_id)}>
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
