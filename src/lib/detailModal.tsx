import useAxios from "@/lib/useAxios";
import Case, {StatusName} from "@/models/Case";
import {modals} from "@mantine/modals";
import {Box, Flex, Grid, Image, Space, Text, Textarea, Timeline} from "@mantine/core";
import {IconCircleCheckFilled, IconClockPause, IconLoader3, IconTools} from "@tabler/icons-react";
import {Carousel} from "@mantine/carousel";
import {BufferToBase64} from "@/lib/helper";
import {notifications} from "@mantine/notifications";
import React from "react";

const showDetail = async (case_id: number,imageHeight:number) => {
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

export default showDetail;
