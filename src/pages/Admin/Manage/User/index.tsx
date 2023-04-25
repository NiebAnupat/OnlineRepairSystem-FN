import {
    Box,
    Button, Center, Chip,
    Container,
    Divider,
    FileButton,
    Flex, Group,
    Image,
    Paper, PasswordInput,
    Space,
    Text,
    TextInput,
    Title
} from "@mantine/core";
import React, {useEffect, useRef, useState} from "react";
import {useDebouncedState} from "@mantine/hooks";
import User from "@/models/User";
import {IconSearch} from "@tabler/icons-react";
import {BufferToBase64} from "@/lib/helper";
import useAxios from "@/lib/useAxios";
import {notifications} from "@mantine/notifications";
import {initUser} from "@/lib/userStore";
import {useRouter} from "next/router";

export const Index = () => {

    const router = useRouter();

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [avatar, setAvatar] = useState<Buffer>(selectedUser?.avatar as Buffer);
    const [file, setFile] = useState<File | null>(null);
    const [searchQuery, setSearchQuery] = useDebouncedState('', 250);
    const [searchErrorText, setSearchErrorText] = useState<string | null>(null);

    const [password, setPassword] = useState<string>('');

    const searchInputRef = useRef<HTMLInputElement>(null);

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
                    const res = await useAxios.put(`users/${selectedUser?.user_id}`, formData);
                    if (res.status == 200) {
                        notifications.show({
                            title: 'อัพโหลดรูปภาพสำเร็จ',
                            message: 'อัพโหลดรูปภาพสำเร็จ',
                            color: 'green',
                        })
                        initUser();
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


    useEffect(() => {
        if (searchQuery.length > 0) {
            useAxios.get(`users/${searchQuery}`).then(res => {
                if (res.status === 200) {
                    setSelectedUser(res.data);
                    setAvatar(res.data.avatar as Buffer);
                    setSearchErrorText(null);
                }
            }).catch(() => {
                setSelectedUser(null);
                setSearchErrorText('ไม่พบข้อมูล');
            })
        } else {
            setSelectedUser(null);
            setSearchErrorText(null);
        }
    }, [searchQuery])

    const updateUser = async () => {
        try {
            const res = await useAxios.put(`users/${selectedUser?.user_id}`, {
                username: selectedUser?.username,
                password: password,
                user_role: selectedUser?.user_role,
            });
            if (res.status == 200) {
                notifications.show({
                    title: 'อัพเดทข้อมูลสำเร็จ',
                    message: 'อัพเดทข้อมูลสำเร็จ',
                    color: 'green',
                })
                initUser();
                setSearchQuery('');
                setSelectedUser(null);
                setPassword('');
                if (searchInputRef.current) {
                    searchInputRef.current.value = '';
                    searchInputRef.current.focus();
                }
            }
        } catch (e) {
            notifications.show({
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่สามารถอัพเดทข้อมูลได้',
                color: 'red',
            })
        }
    }


    return (
        <>
            <Box bg={"gray.1"} h={"100%"} pt={'xl'}>
                <Container size={"90%"}>
                    <Title order={2}>จัดการข้อมูลพนักงาน</Title>
                    <Divider my={'md'}/>
                    <Container size={'90%'}>
                        <Container size={'80%'}>
                            <Flex align={'end'} gap={'md'}>
                                <TextInput placeholder={'ค้นหา...'} radius={'lg'} icon={<IconSearch/>}
                                           description={'ค้นหาด้วยไอดีผู้ใช้งาน'}
                                           sx={{flexGrow: 1}}
                                           ref={searchInputRef}
                                           error={searchErrorText}
                                           onChange={(e) => setSearchQuery(e.currentTarget.value)}
                                />
                                <Button radius={'xl'} variant={'gradient'} gradient={{from: 'blue', to: 'cyan'}}
                                        onClick={() => router.push('/Admin/Manage/User/Create')}>เพิ่มผู้ใช้งาน</Button>
                            </Flex>
                        </Container>
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

                            <Flex align={'center'} gap={'xl'}>
                                <Box>
                                    <FileButton onChange={setFile} accept="image/png,image/jpeg">
                                        {(props) => <Image src={selectedUser && BufferToBase64(avatar)} radius={'md'}
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

                                    <Container size={'70%'}>
                                        <TextInput placeholder={'ชื่อ'} label={'ชื่อผู้ใช้งาน'}
                                                   labelProps={{mb: 'xs', c: 'dark.4'}}
                                                   value={selectedUser?.username || ''}
                                                   onChange={(e) => setSelectedUser({
                                                       ...selectedUser!,
                                                       username: e.currentTarget.value
                                                   })}
                                                   radius={'md'}/>
                                        <PasswordInput my={'md'} placeholder={'รหัสผ่าน'} label={'รหัสผ่าน'}
                                                       labelProps={{mb: 'xs', c: 'dark.4'}}
                                                       error={password && password?.length < 6 && 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'}
                                                       value={password}
                                                       onChange={(e) => setPassword(e.currentTarget.value)}
                                                       radius={'md'}/>
                                    </Container>

                                    <Divider my={'xl'}/>
                                    <Box>
                                        <Chip.Group multiple={false} value={selectedUser?.user_role}
                                                    onChange={value => {
                                                        setSelectedUser({...selectedUser!, user_role: value})
                                                    }
                                                    }>
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
                                        >ยกเลิก</Button>
                                        <Button ml={'md'} radius={'md'} variant={'gradient'} type={'submit'}
                                                gradient={{from: 'indigo', to: 'cyan'}}
                                                disabled={!selectedUser?.username || !password || password?.length < 6}
                                                onClick={updateUser}
                                        >บันทึก</Button>
                                    </Center>
                                    <Space h={'xl'}/>
                                    <Text c={'dimmed'} fz={'xs'} mt={'xl'} align={'start'}>
                                        แก้ไขล่าสุดเมื่อ {selectedUser?.changeAt && new Date(selectedUser!.changeAt).toLocaleDateString('th-TH') || '-'}
                                    </Text>
                                </Box>
                            </Flex>

                        </Paper>
                    </Container>
                </Container>
            </Box>
        </>
    )
        ;
};

export default Index;
