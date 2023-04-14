import {Box, Button, Container, Flex, Paper, Space, Text, Textarea, TextInput, Title} from "@mantine/core";
import {Dropzone, IMAGE_MIME_TYPE} from '@mantine/dropzone';
import React, {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import {IconMapPinFilled, IconNotes} from "@tabler/icons-react";
import {useInterval} from "@mantine/hooks";
import {useUserStore} from "@/lib/userStore";
import useAxios from "@/lib/useAxios";
import axios from "axios";

export default function Repairing() {

    const userID = useUserStore(state => state.user?.user_id) || '';

    const form = useForm({
        initialValues: {
            name_case: '',
            detail_case: '',
            place_case: '',
            images: [] as File[],
        },

        validate: {
            name_case: (value) => !value && 'กรุณากรอกหัวข้อการรายงาน',
            detail_case: (value) => !value && 'กรุณากรอกรายละเอียดการรายงาน',
            place_case: (value) => !value && 'กรุณากรอกสถานที่',
            images: () => !droppedImage && 'กรุณาเพิ่มรูปภาพ',
        }
    })


    const [droppedImage, setDroppedImage] = useState<File | null>(null);
    const suffleImage = useInterval(() => {
        // suffle images every 5 seconds
        if (form.values.images.length > 0) {
            setDroppedImage(form.values.images[Math.floor(Math.random() * form.values.images.length)]);
        }
    }, 5000);


    useEffect(() => {
        // Update dropped image when images in form change
        if (form.values.images.length > 0) {
            suffleImage.start();
            return suffleImage.stop;
        } else {
            setDroppedImage(null)
        }
    }, [form.values.images]);

    const handleSubmit = async (values: any) => {
        try {
            const formData = new FormData();
            formData.append('user_id', userID);
            formData.append('name_case', values.name_case);
            formData.append('detail_case', values.detail_case);
            formData.append('place_case', values.place_case);
            values.images.forEach((image: File) => {
                formData.append('images', image);
            })

            const res = await useAxios.post('cases', formData)

            if (res.status === 200) {
                clearForm();
                console.log('success')
            }

        } catch (e) {
            if (axios.isAxiosError(e)) {
                const status = e.response?.status;
                if (status === 400) {
                    form.setFieldError('images', 'กรุณาเพิ่มรูปภาพ');
                } else if (status === 404) {
                    console.log('รายงานไม่สำเร็จ')
                } else {
                    console.log(e.message)
                }
            }
        }

    }

    const clearForm = () => {
        form.reset();
        setDroppedImage(null);
    }

    return <>
        <Box bg={"gray.1"} h={"100%"} pt={'xl'} sx={{userSelect: 'none'}}>
            <Container size={"90%"} sx={{minHeight: '600px', minWidth: "800px"}}>
                <Title order={2}>ทำรายการแจ้งซ่อม</Title>
                <Paper bg={'white'} mt={'xl'} p={'xl'} radius={'md'} withBorder shadow={'sm'}>
                    <Title order={5}>แบบฟอร์มแจ้งซ่อมอุปกรณ์</Title>
                    <Container size={'md'} my={'md'}>
                        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                            <TextInput mt={'md'} label={'หัวข้อการรายงาน'}
                                       icon={<IconNotes/>} {...form.getInputProps('name_case')}/>
                            <TextInput mt={'md'} label={'สถานที่'}
                                       icon={<IconMapPinFilled/>} {...form.getInputProps('place_case')}/>
                            <Flex mt={'md'} gap={'md'}>
                                <Textarea label={'รายละเอียดการรายงาน'} w={'70%'}
                                          autosize
                                          minRows={10}
                                          maxRows={10}
                                          {...form.getInputProps('detail_case')}
                                />
                                <Flex direction={'column'} sx={{flexGrow: 1}}>
                                    <Dropzone
                                        accept={IMAGE_MIME_TYPE}
                                        sx={{
                                            display: 'flex',
                                            flexGrow: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'relative', // Add this line to make the child div position relative
                                            border: form.errors.images ? '1px solid red' : undefined,
                                        }}
                                        onDrop={(files) => {
                                            form.setFieldValue('images', files);
                                            setDroppedImage(files[0]); // Update the dropped image state
                                        }}
                                        className="dropzone"
                                        style={{
                                            backgroundImage: droppedImage ? `url(${URL.createObjectURL(droppedImage)})` : undefined,
                                            backgroundSize: 'cover',
                                        }}
                                    >
                                        {droppedImage ? (
                                            <Text align="center" bg={'white'} c={'dark.3'} fz={'sm'} p={'4px'}
                                                  sx={{borderRadius: '5px'}}>ตัวอย่างรูปภาพ</Text>
                                        ) : (
                                            <Text align="center">วางรูปภาพที่นี่</Text>
                                        )}
                                    </Dropzone>
                                    {/*  display dropzone error  */}
                                    {form.errors.images && ( // Display error if any
                                        <Text color="red" mt={1} fz={'xs'} align={'center'}>
                                            {form.errors.images}
                                        </Text>
                                    )}
                                </Flex>
                            </Flex>
                            <Space mt={'xl'}/>
                            <Flex justify={'flex-end'} gap={'md'}>
                                <Button variant={'outline'} color={'red'} onClick={clearForm}>ลบข้อมูล</Button>
                                <Button type={'submit'}>รายงาน</Button>
                            </Flex>
                        </form>
                    </Container>
                    <Text mt={'xl'} c={'dimmed'} fz={'sm'}>กรุณากรอกข้อมูลให้ครบถ้วน</Text>
                </Paper>
            </Container>
        </Box>
    </>
}
