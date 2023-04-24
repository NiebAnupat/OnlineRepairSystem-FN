import {Box, Button, Center, Container, Divider, PasswordInput, Title} from "@mantine/core";
import React from "react";
import {useForm} from "@mantine/form";
import useAxios from "@/lib/useAxios";
import {useUserStore} from "@/lib/userStore";
import {notifications} from "@mantine/notifications";
import {AxiosError} from "axios";
import {useRouter} from "next/router";

const ChangePassword = () => {

    const userID = useUserStore(state => state.user?.user_id)
    const router = useRouter();

    const form = useForm(
        {
            initialValues: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            },

            validate: {
                oldPassword: (value) => !value && 'กรุณากรอกรหัสผ่านเดิม',
                newPassword: (value) => {
                    if (!value) return 'กรุณากรอกรหัสผ่านใหม่';
                    if (value.length < 6) return 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
                    if (value === form.values.oldPassword) return 'รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม';
                    if (value.length > 20) return 'รหัสผ่านต้องมีความยาวไม่เกิน 20 ตัวอักษร';
                    if (value !== form.values.confirmPassword) return 'รหัสผ่านไม่ตรงกัน';
                },
                confirmPassword: (value) => {
                    if (!value) return 'กรุณากรอกรหัสผ่านใหม่อีกครั้ง';
                    if (value !== form.values.newPassword) return 'รหัสผ่านไม่ตรงกัน';
                }
            }
        })

    const handleSubmit = async () => {
        try {

            // check old password
            const loginRes = await useAxios.post(`auth/`, {
                user_id: userID,
                password: form.values.oldPassword
            })

            if (loginRes.status == 200) {
                // change password
                const changePasswordRes = await useAxios.put(`users/${userID}`, {
                    password: form.values.newPassword
                })

                if (changePasswordRes.status == 200) {

                    notifications.show({
                        title: 'เปลี่ยนรหัสผ่านสำเร็จ',
                        message: 'รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว',
                        color: 'green',
                    })

                    form.reset();
                    await router.back();
                }
            }

        } catch (e) {
            if (e instanceof AxiosError) {
                if (e.response?.status == 401) {
                    notifications.show({
                        title: 'เปลี่ยนรหัสผ่านไม่สำเร็จ',
                        message: 'รหัสผ่านเดิมไม่ถูกต้อง',
                        color: 'red',
                    })
                    form.setFieldError('oldPassword', 'รหัสผ่านไม่ถูกต้อง')
                    return;
                }

            }

            console.log(e)

            notifications.show({
                title: 'เปลี่ยนรหัสผ่านไม่สำเร็จ',
                message: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน',
                color: 'red',
            })

            form.reset();
        }
    };

    return (
        <>
            <Box bg={"gray.1"} h={"100%"} pt={'xl'}>
                <Container size={"90%"}>
                    <Title order={2}>เปลี่ยนรหัสผ่าน</Title>
                    <Divider my={'md'}/>
                    <Container size={'50%'} h={'80vh'} display={'flex'} sx={{alignItems: 'center'}}>
                        <Box sx={{flexGrow: 1}}>
                            <form onSubmit={form.onSubmit(handleSubmit)}>
                                <PasswordInput label={'รหัสผ่านเดิม'} {...form.getInputProps('oldPassword')}/>
                                <PasswordInput my={'md'} label={'รหัสผ่านใหม่'} {...form.getInputProps('newPassword')}/>
                                <PasswordInput label={'ยืนยันรหัสผ่านใหม่'} {...form.getInputProps('confirmPassword')}/>
                                <Center mt={'xl'}>
                                    <Button variant={'outline'} color={'red'} radius={'md'}
                                            onClick={useRouter().back}>ยกเลิก</Button>
                                    <Button ml={'md'} radius={'md'} variant={'gradient'} type={'submit'}
                                            gradient={{from: 'indigo', to: 'cyan'}}>บันทึก</Button>
                                </Center>
                            </form>
                        </Box>
                    </Container>
                </Container>

            </Box>
        </>
    );
};

export default ChangePassword;
