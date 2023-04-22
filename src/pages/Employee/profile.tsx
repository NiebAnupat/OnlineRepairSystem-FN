import {
    Box,
    Button,
    Center,
    Container,
    Divider, FileButton,
    Flex,
    Image,
    PasswordInput,
    Text,
    TextInput,
    Title
} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {initialUser, useUserStore} from "@/lib/userStore";
import User from "@/models/User";
import {BufferToBase64} from "@/lib/helper";
import {useForm} from "@mantine/form";
import useAxios from "@/lib/useAxios";
import {notifications} from "@mantine/notifications";
import {AxiosError} from "axios";
import {useRouter} from "next/router";

export default function Profile() {
    const user: User | null = useUserStore(state => state.user)
    const username = useUserStore(state => state.user?.username)
    const setUser = useUserStore(state => state.setUser)
    const [avatar, setAvatar] = useState<Buffer>(user?.avatar as Buffer);
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter();
    const form = useForm({
        initialValues: {
            username: username,
            password: '',
            confirmPassword: '',
        },

        validate: {
            username: (value) => !value && 'กรุณากรอกชื่อผู้ใช้งาน',
            password: (value) => {
                if (!value) return 'กรุณากรอกรหัสผ่าน';
                if (value.length < 6) return 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
                if (value.length > 20) return 'รหัสผ่านต้องมีความยาวไม่เกิน 20 ตัวอักษร';
                if (value !== form.values.confirmPassword) return 'รหัสผ่านไม่ตรงกัน';
            },
            confirmPassword: (value) => {
                if (!value) return 'กรุณากรอกรหัสผ่านอีกครั้ง';
                if (value !== form.values.password) return 'รหัสผ่านไม่ตรงกัน';
            },
        }
    })


    const handleSubmit = async () => {
        const {username, password} = form.values;
        const formData = new FormData();
        username && formData.append('username', username);
        password && formData.append('password', password);

        try {

            const authRes = await useAxios.post(`auth/`, {
                user_id: user?.user_id,
                password: password
            })

            if (authRes.status != 200) {
                form.setFieldError('password', 'รหัสผ่านไม่ถูกต้อง');
                form.setFieldValue('confirmPassword', '');
                return;
            }

            const userRes = await useAxios.put(`users/${user?.user_id}`, formData);
            if (userRes.status == 200) {
                notifications.show({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    message: 'บันทึกข้อมูลสำเร็จ',
                    color: 'green',
                })

                const user = await initialUser() as User;
                setUser(user);
                form.setFieldValue('password', '');
                form.setFieldValue('confirmPassword', '');

            }


        } catch (e) {

            if (e instanceof AxiosError) {
                if (e.response?.status == 401) {
                    form.setFieldError('password', 'รหัสผ่านไม่ถูกต้อง');
                    form.setFieldValue('confirmPassword', '');
                    return;
                }
            }

            notifications.show({
                title: 'เกิดข้อผิดพลาด',
                message: 'บันทึกข้อมูลไม่สำเร็จ',
                color: 'red',
            })
        }


    }


    useEffect(() => {
        if (file) {
            // file to buffer
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async () => {
                const buffer = reader.result;
                // show preview
                setAvatar(buffer as Buffer);
                const formData = new FormData();
                formData.append('image', file);
                // upload image
                try {
                    const res = await useAxios.put(`users/${user?.user_id}`, formData);
                    if (res.status == 200) {
                        notifications.show({
                            title: 'อัพโหลดรูปภาพสำเร็จ',
                            message: 'อัพโหลดรูปภาพสำเร็จ',
                            color: 'green',
                        })
                        initialUser().then((user) => user && setUser(user))
                    }
                } catch (e) {
                    notifications.show({
                        title: 'เกิดข้อผิดพลาด',
                        message: 'ไม่สามารถอัพโหลดรูปภาพได้',
                        color: 'red',
                    })
                }
            }
        }
    }, [file])
    return <>
        <Box bg={"gray.1"} h={"100%"} pt={'xl'}>
            <Container size={"90%"}>
                <Title order={2}>ข้อมูลส่วนตัว</Title>
                <Divider my={'md'}/>
                <Container>
                    <Flex h={'85vh'} align={'center'} gap={'xl'}>
                        <Box>
                            <FileButton onChange={setFile} accept="image/png,image/jpeg">
                                {(props) => <Image src={user && BufferToBase64(avatar)} radius={'md'}
                                                   height={400}
                                                   width={350}
                                                   sx={{cursor: 'pointer'}} {...props}/>}
                            </FileButton>
                            <Text align={'center'} mt={'sm'} fz={'xs'}
                                  c={'dimmed'}>คลิกที่รูปเพื่อเปลี่ยนรูปภาพ</Text>
                        </Box>

                        <Box h={'70%'} p={'md'} sx={{flexGrow: 1, textAlign: 'center'}}>
                            <Container size={'70%'}>
                                <form onSubmit={form.onSubmit( handleSubmit)}>
                                    <TextInput placeholder={'ชื่อ'} label={'ชื่อผู้ใช้งาน'}
                                               labelProps={{mb: 'xs', c: 'dark.4'}}
                                               radius={'md'} {...form.getInputProps('username')}/>
                                    <PasswordInput my={'md'} placeholder={'รหัสผ่าน'} label={'รหัสผ่าน'}
                                                   labelProps={{mb: 'xs', c: 'dark.4'}}
                                                   radius={'md'} {...form.getInputProps('password')}/>
                                    <PasswordInput placeholder={'ยืนยันรหัสผ่าน'} label={'ยืนยันรหัสผ่าน'}
                                                   labelProps={{mb: 'xs', c: 'dark.4'}}
                                                   radius={'md'} {...form.getInputProps('confirmPassword')}/>

                                    <Center mt={'xl'}>
                                        <Button variant={'outline'} color={'red'} radius={'md'}
                                                onClick={form.reset}>ยกเลิก</Button>
                                        <Button ml={'md'} radius={'md'} variant={'gradient'} type={'submit'}
                                                gradient={{from: 'indigo', to: 'cyan'}}>บันทึก</Button>
                                    </Center>
                                </form>
                                <Text c={'dimmed'} fz={'xs'} align={'end'} mt={'xl'}
                                      sx={{cursor: 'pointer'}} onClick={() => router.push('/Employee/ChangePassword')}
                                >เปลี่ยนรหัสผ่าน</Text>
                            </Container>
                        </Box>
                    </Flex>
                </Container>
            </Container>
        </Box>
    </>
        ;
}
