import React, {FunctionComponent, useEffect, useState} from 'react';
import Case, {getStatusColor, StatusName} from "@/models/Case";
import {
    Badge,
    Box,
    Card,
    Flex,
    Grid,
    Group,
    Image,
    Space,
    Text,
    Textarea,
    Timeline,
    UnstyledButton
} from "@mantine/core";
import {modals} from '@mantine/modals';
import {Carousel} from '@mantine/carousel';
import {useInterval} from "@mantine/hooks";
import {BufferToBase64} from "@/lib/helper";
import {IconCircleCheckFilled, IconClockPause, IconLoader3, IconTools} from "@tabler/icons-react";

interface OwnProps {
    case: Case,
}

type Props = OwnProps;

const HistoryCard: FunctionComponent<Props> = (props) => {

    const {
        images,
        name_case,
        detail_case,
        statuses,
        case_id,
        place_case,
        date_case,
        date_assign,
        date_sent,
        date_close,
        tec_id,
        users_cases_tec_idTousers
    } = props.case;
    const [thumbnail, setThumbnail] = useState<Buffer>();

    const shuffleImage = useInterval(() => {
        // shuffle images every 5 seconds
        if (images.length > 0) {
            setThumbnail(images[Math.floor(Math.random() * images.length)].image);
        }
    }, 5000);

    useEffect(() => {
        shuffleImage.start();
        return shuffleImage.stop;
    }, [])

    useEffect(() => {
        setThumbnail(images[0].image)
    }, [images]);


    const getRandomPlaceColor = (): string => {
        const colors = ['green', 'blue', 'indigo', 'purple', 'pink', 'cyan', 'orange'];
        return colors[Math.floor(Math.random() * colors.length)];
    }


    const [imageHeight, setImageHeight] = useState<number>();
    useEffect(() => {
        const windowHeight = window.innerHeight;
        if (windowHeight < 720) {
            setImageHeight(175)
        } else if (windowHeight < 800) {
            setImageHeight(200)
        } else if (windowHeight < 900) {
            setImageHeight(225)
        } else setImageHeight(350)
    }, [])
    const viewDetail = () => {
        const {status_id} = statuses;
        const activeStatus = status_id - 1;
        modals.open({
            title: `รายละเอียดของ ${name_case}`,
            size: '90%',
            padding: 'lg',
            radius: 'lg',
            shadow: 'md',
            children: (
                <Box >
                    <Flex gap={'xl'}>
                        <Timeline active={activeStatus} color="violet" bulletSize={30} lineWidth={4}  sx={{flexGrow: 1}}>
                            <Timeline.Item title={StatusName.PENDING} bullet={<IconClockPause size={20}/>}>
                                <Text color="dimmed" size="sm">
                                    รายการแจ้งซ่อมนี้ได้ถูกส่งเข้าระบบแล้ว
                                </Text>
                                <Text mt={3} size="xs">วันที่ {new Date(date_case).toLocaleDateString('th-TH')}</Text>
                                <Space h="xl"/>
                            </Timeline.Item>

                            <Timeline.Item title={StatusName.IN_PROGRESS} bullet={<IconLoader3 size={20}/>}>
                                <Text color="dimmed" size="sm">
                                    เจ้าหน้าที่ได้รับคำขอแจ้งซ่อมแล้ว
                                </Text>
                                {date_assign && (<Text mt={3}
                                                       size="xs">วันที่ {new Date(date_assign).toLocaleDateString('th-TH')}</Text>)}
                                <Space h="xl"/>
                            </Timeline.Item>

                            <Timeline.Item title={StatusName.REPAIRING} bullet={<IconTools size={20}/>}
                                           lineVariant="dashed">
                                <Text color="dimmed" size="sm">
                                    เจ้าหน้าที่กำลังดำเนินการซ่อม
                                </Text>
                                {date_sent && (
                                    <Text mt={3}
                                          size="xs">วันที่ {new Date(date_sent).toLocaleDateString('th-TH')}</Text>)}
                                <Space h="xl"/>
                            </Timeline.Item>

                            <Timeline.Item title={StatusName.REPAIRED} bullet={<IconCircleCheckFilled size={20}/>}>
                                <Text color="dimmed" size="sm">
                                    เจ้าหน้าที่ได้ดำเนินการซ่อมเสร็จสิ้นแล้ว
                                </Text>
                                {date_close && (<Text mt={3}
                                                      size="xs">วันที่ {new Date(date_close).toLocaleDateString('th-TH')}</Text>)}
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
                                        {case_id}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Text size="md" weight={600}>
                                        สถานที่
                                    </Text>
                                    <Text size='sm' ml={'md'} color="dimmed">
                                        {place_case}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Text size="md" weight={600}>
                                        ชื่อผู้แจ้ง
                                    </Text>
                                    <Text size='sm' ml={'md'} color="dimmed">
                                        {props.case.users_cases_user_idTousers.username}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Text size="md" weight={600}>
                                        ช่างซ่อม
                                    </Text>
                                    <Text size='sm' ml={'md'} color="dimmed">
                                        {tec_id ? users_cases_tec_idTousers?.username : 'รอการตรวจสอบ'}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <Textarea
                                        value={detail_case}
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
                                    <Carousel slideSize="50%" height={imageHeight} slideGap="md" controlsOffset="md"
                                              loop withIndicators>
                                        {images.map((image, index) => (
                                            <Carousel.Slide key={index}>
                                                <Image src={image && BufferToBase64(image.image) || ''} withPlaceholder
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
                                                            <Image src={image && BufferToBase64(image.image) || ''}
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


    return (
        <>
            <UnstyledButton sx={{
                "&:hover": {
                    transform: "translateY(-5px)",
                    transition: "all 0.2s ease-in-out",
                },
                transition: "transform 0.2s ease-in-out",
            }} onClick={viewDetail}
            >
                <Card shadow="sm" padding="lg" radius="md" sx={{
                    "&:hover": {
                        "boxShadow": "4px 12px 41px 0px rgba(50,0,150,0.1)"
                    },
                }}>
                    <Card.Section>
                        <Image
                            src={thumbnail && BufferToBase64(thumbnail)}
                            alt="Case thumbnail"
                            height={150}
                            withPlaceholder/>
                    </Card.Section>
                    <Group position="apart" mt="md" mb="xs">
                        <Text weight={600}>
                            {props.case.name_case}
                        </Text>
                        <Badge color="blue">รหัส: {case_id}</Badge>
                        <Badge
                            color={getStatusColor(statuses.status_name)}>สถานะ: {statuses.status_name}</Badge>
                        <Badge color={getRandomPlaceColor()}>สถานที่: {place_case}</Badge>
                        <Badge
                            color={getRandomPlaceColor()}>วันที่: {new Date(date_case).toLocaleDateString('th-TH')}</Badge>
                    </Group>
                </Card>
            </UnstyledButton>
        </>
    );
};

export default HistoryCard;
