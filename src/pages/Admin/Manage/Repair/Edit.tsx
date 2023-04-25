import {GetServerSideProps, GetServerSidePropsContext} from "next";
import useAxios from "@/lib/useAxios";
import Case, {StatusID} from "@/models/Case";
import {
    Box, Button,
    Container,
    Divider,
    Flex,
    Image,
    SimpleGrid,
    Space,
    Stack,
    Textarea,
    TextInput,
    Title
} from "@mantine/core";
import React, {useState} from "react";
import {Carousel} from "@mantine/carousel";
import {BufferToBase64} from "@/lib/helper";
import {modals} from "@mantine/modals";
import {useRouter} from "next/router";
import {AxiosError} from "axios";
import {notifications} from "@mantine/notifications";
import moment from "moment";
import {initialCases} from "@/lib/caseStore";

interface props {
    selectedCase: Case;
}

export const Edit = ({selectedCase}: props) => {
    const router = useRouter();
    const [nameCase, setNameCase] = useState<string>(selectedCase.name_case);
    const [detailCase, setDetailCase] = useState<string>(selectedCase.detail_case);
    const [placeCase, setPlaceCase] = useState<string>(selectedCase.place_case);
    const [tecID, setTecID] = useState<string>(selectedCase.tec_id || '');
    const [tecName, setTecName] = useState<string>(selectedCase.users_cases_tec_idTousers?.username || '');
    const [tecIDError, setTecIDError] = React.useState<string>('');

    const checkTec = () => {
        if (tecID) {

            useAxios.get(`users/${tecID}`).then(res => {
                if (res.status === 200) {
                    setTecName(res.data.username)
                    setTecIDError('')
                }
            }).catch((err: AxiosError) => {
                if (err.response?.status === 404) {
                    setTecName('')
                    setTecIDError('ไม่พบช่างซ่อม')
                }
            })

        } else {
            setTecName('')
            setTecIDError('ไม่พบช่างซ่อม')
        }
    }

    const updateCase = () => {
        const oldTecID = selectedCase.tec_id
        const hasTecID: boolean = oldTecID != null

        if (hasTecID) {
            if (!tecID) {
                setTecIDError('กรุณากรอกช่างซ่อม')
                return;
            }
        }

        useAxios.put(`cases/${selectedCase.case_id}/admin`, {
            ...(nameCase && {name_case: nameCase}),
            ...(detailCase && {detail_case: detailCase}),
            ...(placeCase && {place_case: placeCase}),
            ...(tecID && {tec_id: tecID}),
            ...(!hasTecID && tecID && {status_id: StatusID.IN_PROGRESS, date_assign: moment().format('YYYY-MM-DD')}),
        }).then(res => {
            if (res.status === 200) {
                notifications.show({
                    title: 'แก้ไขรายการแจ้งซ่อมสำเร็จ',
                    message: 'ระบบได้ทำการแก้ไขรายการแจ้งซ่อมเรียบร้อยแล้ว',
                    color: 'teal',
                })
                initialCases()
                router.push('/Admin/Manage/Repair')
            }
        })
    }


    return (
        <>
            <Box bg={"gray.1"} h={"100%"} pt={'xl'}>
                <Container size={"90%"}>
                    <Title order={3}>รายการแจ้งซ่อมหมายเลข {selectedCase.case_id}</Title>
                    <Divider my={'sm'}/>
                    <Space h={'xl'}/>
                    <Container mt={'xl'}>
                        <Carousel slideSize={350} height={200} slideGap="md"
                                  controlsOffset="md"
                                  loop withIndicators>
                            {selectedCase.images.map((image, index) => (
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

                        <Space h={'xl'}/>
                        <SimpleGrid cols={2}>
                            <TextInput label={'ชื่อรายการ'} radius={'md'} value={nameCase} onChange={(e) => {
                                setNameCase(e.currentTarget.value)
                            }}/>
                            <TextInput label={'สถานที่'} radius={'md'} value={placeCase} onChange={(e) => {
                                setPlaceCase(e.currentTarget.value)
                            }}/>
                            <Textarea label={'รายละเอียด'} radius={'md'} value={detailCase} minRows={5}
                                      onChange={(e) => {
                                          setDetailCase(e.currentTarget.value)
                                      }}/>
                            <Stack py={'xs'}>
                                <Flex gap={'md'} align={'center'}>
                                    <TextInput label={'รหัสช่างซ่อม'} radius={'md'} value={tecID} sx={{flexGrow: 1}}
                                               error={tecIDError} onChange={(e) => {
                                        setTecID(e.currentTarget.value)
                                    }}/>
                                    <Button size={'sm'} mt={'lg'} compact onClick={checkTec}>ตรวจสอบ</Button>
                                </Flex>
                                <TextInput label={'ชื่อช่างซ่อม'} radius={'md'} value={tecName} disabled/>
                            </Stack>
                        </SimpleGrid>
                        <Space h={'xl'}/>
                        <Flex justify={'flex-end'}>
                            <Button color={'red'} variant={'outline'} onClick={() => router.back()}>ยกเลิก</Button>
                            <Space w={'sm'}/>
                            <Button color={'green'} variant={'gradient'}
                                    gradient={{from: 'violet.4', to: 'blue.5'}} onClick={updateCase}>บันทึก</Button>
                        </Flex>
                    </Container>
                </Container>
            </Box>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const caseID = context.query.caseID;
    const res = await useAxios.get(`cases/${caseID}?getImages=true`);
    if (res.status === 200) {
        console.log(res.data)
        return {
            props: {
                selectedCase: res.data as Case
            }
        }
    }
    return {
        props: {
            selectedCase: []
        }
    }
}

export default Edit;
