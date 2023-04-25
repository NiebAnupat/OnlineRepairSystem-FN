import {
    Box, Button,
    Center, Chip,
    Container,
    Divider,
    FileButton,
    Flex, Group,
    Image, Paper,
    PasswordInput, SimpleGrid,
    Text,
    TextInput,
    Title
} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {BufferToBase64} from "@/lib/helper";
import {useRouter} from "next/router";
import useAxios from "@/lib/useAxios";
import {AxiosError} from "axios";
import {notifications} from "@mantine/notifications";

export const Create = () => {

    const router = useRouter();

    const [avatar, setAvatar] = useState<Buffer>();
    const [file, setFile] = useState<File | null>(null);

    const [userID, setUserID] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [role, setRole] = useState<string>('');

    useEffect(() => {
        if (file) {
            // file to buffer
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async () => {
                const buffer = reader.result;
                // show preview
                setAvatar(buffer as Buffer);
            }
        }
    }, [file])

    const createUser = async () => {
        const formData = new FormData();
        formData.append('user_id', userID)
        formData.append('username', username);
        formData.append('password', password);
        formData.append('user_role', role);
        file && formData.append('image', file);

        try {
            const res = await useAxios.post(`users/`, formData);
            if (res.status === 201) {
                // reset all state
                setUserID('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                setRole('');
                setAvatar(undefined);
                setFile(null);

                return notifications.show({
                    title: 'สร้างผู้ใช้งานสำเร็จ',
                    message: 'สร้างผู้ใช้งานสำเร็จ บันทึกข้อมูลเรียบร้อยแล้ว',
                    color: 'teal',
                })
            }
        } catch (e) {
            // reset all state
            setUserID('');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setRole('');
            setAvatar(undefined);
            setFile(null);
            if (e instanceof AxiosError) {
                if (e.response?.status === 409) {
                    return notifications.show({
                        title: 'มีผู้ใช้งานนี้อยู่แล้ว',
                        message: 'มีผู้ใช้งานนี้อยู่แล้วในระบบ',
                        color: 'red',
                    })
                }
            }

            return notifications.show({
                title: 'เกิดข้อผิดพลาด',
                message: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้งาน',
                color: 'red',
            })
        }
    }

    return (
        <>
            <Box bg={"gray.1"} h={"100%"} pt={'xl'}>
                <Container size={"90%"}>
                    <Title order={2}>เพิ่มข้อมูลผู้ใช้งาน</Title>
                    <Divider my={'md'}/>
                    <Paper
                        p={'xl'}
                        radius='lg'
                        mt={'md'}
                        shadow='md'
                        sx={{
                            '&:hover': {
                                boxShadow: '4px 12px 41px 0px rgba(50,0,150,0.1)',
                            },
                        }}
                    >

                        <Flex align={'center'} gap={'xl'} px={'xl'}>
                            <Box>
                                <FileButton onChange={setFile} accept="image/png,image/jpeg">
                                    {(props) => <Image src={avatar && BufferToBase64(avatar)} radius={'md'}
                                                       height={400}
                                                       width={350}
                                                       sx={{cursor: 'pointer'}}
                                                       withPlaceholder
                                                       {...props}/>}
                                </FileButton>
                                <Text align={'center'} mt={'sm'} fz={'xs'}
                                      c={'dimmed'}>คลิกที่รูปเพื่อเปลี่ยนรูปภาพ</Text>
                            </Box>

                            <Box h={'70%'} p={'md'} sx={{flexGrow: 1, textAlign: 'center'}}>
                                <Container size={'90%'}>
                                    <SimpleGrid cols={2} spacing={'md'}>
                                        <TextInput placeholder={'ไอดีผู้ใช้งาน'} label={'ไอดีผู้ใช้งาน'}
                                                   labelProps={{mb: 'xs', c: 'dark.4'}}
                                                   value={userID || ''}
                                                   onChange={(e) => setUserID(e.currentTarget.value)}
                                                   radius={'md'}
                                        />
                                        <PasswordInput placeholder={'รหัสผ่าน'} label={'รหัสผ่าน'}
                                                       labelProps={{mb: 'xs', c: 'dark.4'}}
                                                       error={password && password?.length < 6 && 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'}
                                                       value={password}
                                                       onChange={(e) => setPassword(e.currentTarget.value)}
                                                       radius={'md'}/>
                                        <TextInput placeholder={'ชื่อ'} label={'ชื่อผู้ใช้งาน'}
                                                   labelProps={{mb: 'xs', c: 'dark.4'}}
                                                   value={username || ''}
                                                   onChange={(e) => setUsername(e.currentTarget.value)}
                                                   radius={'md'}/>

                                        <PasswordInput placeholder={'ยืนยันรหัสผ่าน'}
                                                       label={'ยืนยันรหัสผ่าน'}
                                                       labelProps={{mb: 'xs', c: 'dark.4'}}
                                                       error={confirmPassword && confirmPassword !== password && 'รหัสผ่านไม่ตรงกัน'}
                                                       value={confirmPassword}
                                                       onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                                                       radius={'md'}/>
                                    </SimpleGrid>

                                    <Divider my={'xl'}/>
                                    <Box>
                                        <Chip.Group multiple={false} onChange={setRole}>
                                            <Text fz={'sm'} c={'dark.4'}>ประเภทผู้ใช้งาน</Text>
                                            <Group position="center" mt={'md'}>
                                                <Chip value="employee" color={'blue'}
                                                      variant={'filled'}>พนักงานทั่วไป</Chip>
                                                <Chip value="worker" color={'orange'}
                                                      variant={'filled'}>ช่างซ่อมบำรุง</Chip>
                                                <Chip value="admin" color={'indigo'}
                                                      variant={'filled'}>ผู้ดูแลระบบ</Chip>
                                            </Group>
                                        </Chip.Group>
                                    </Box>
                                    <Text mt={'xl'} fz={'xs'} c={'dimmed'}
                                          align={'end'}>กรุณากรอกข้อมูลให้ครบถ้วน</Text>
                                    <Center mt={'xl'}>
                                        <Button variant={'outline'} color={'red'} radius={'md'}
                                                onClick={() => router.back()}
                                        >ยกเลิก</Button>
                                        <Button ml={'md'} radius={'md'} variant={'gradient'} type={'submit'}
                                                gradient={{from: 'indigo', to: 'cyan'}}
                                                disabled={!username || !password || password?.length < 6 || confirmPassword !== password || !role || !userID}
                                                onClick={createUser}
                                        >บันทึก</Button>
                                    </Center>

                                </Container>
                            </Box>
                        </Flex>
                    </Paper>
                </Container>
            </Box>
        </>
    );
};

export default Create;
