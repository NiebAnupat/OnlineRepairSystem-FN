import React from "react";
import {useRouter} from "next/router";
import {
    BackgroundImage,
    Box,
    Button,
    Container,
    Image,
    Notification,
    PasswordInput,
    Text,
    TextInput,
} from "@mantine/core";
import {useForm} from '@mantine/form';
import {IconKey, IconLogin, IconUser} from "@tabler/icons-react";
import illustration from "@/assets/IllustrationProjectManager/SVG/Illustration2.svg";
import loginBG from "@/assets/img/login-bg.png";
import {UserSignInResponse} from "@/models/User";
import useAxios from "@/lib/useAxios";
import axios from "axios";


export default function Index() {
    const router = useRouter();


    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");


    const form = useForm(
        {
            initialValues: {
                user_id: '',
                password: ''
            },


            validate: {
                user_id: (value) => !value && 'กรุณากรอกรหัสพนักงาน',
                password: (value) => !value && 'กรุณากรอกรหัสผ่าน'
            },
        })

    const handleSubmit = async (user_id: string, password: string) => {
        setLoading(true);
        try {
            const res = await useAxios.post<UserSignInResponse>("auth/", {
                user_id,
                password
            });
            const token = res.data.token;
            // save token to cookie
            document.cookie = `token=${token}; path=/`;
            router.reload();
        } catch (e: any) {
            setLoading(false);
            if (axios.isAxiosError(e)) {
                const status = e.response?.status;
                if (status === 401) {
                    setError("รหัสผ่านไม่ถูกต้อง");
                    form.setFieldError("password", "รหัสผ่านไม่ถูกต้อง");
                } else if (status === 404) {
                    setError("ไม่พบรหัสพนักงานนี้");
                    form.setFieldError("user_id", "ไม่พบรหัสพนักงานนี้");
                    form.setFieldValue("password", "");
                } else {
                    setError("เกิดข้อผิดพลาด");
                    form.reset();
                }
            } else {
                setError("เกิดข้อผิดพลาด");
                form.reset();
            }

            setTimeout(() => {
                setError("");
            }, 3000);
        }
    };

    const renderError = () => (
        <Notification
            color="red"
            radius="md"
            title="เกิดข้อผิดพลาด"
            sx={(theme) => ({
                textAlign: "center",
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                margin: "auto",
                marginBottom: theme.spacing.lg,
                width: "80%",
                zIndex: 2,
                opacity: error ? 1 : 0,
                transition: "opacity 0.5s",
            })}
            withCloseButton={false}
        >
            {error}
        </Notification>
    );

    const renderLoading = () => (
        <Notification
            color="blue"
            radius="md"
            loading
            title="กำลังเข้าสู่ระบบ"
            sx={(theme) => ({
                textAlign: "center",
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                margin: "auto",
                marginBottom: theme.spacing.lg,
                width: "80%",
                zIndex: 2,
                opacity: loading ? 1 : 0,
                transition: "opacity 0.5s",
            })}
            withCloseButton={false}
        >
            กรุณารอสักครู่
        </Notification>
    );

    return (
        <Box h={"100vh"} w={"100vw"}>
            <BackgroundImage src={loginBG.src} h={'100%'} w={'100%'} p={"xl"}>
                {renderLoading()}
                {renderError()}
                <Container
                    h={"100%"}
                    size={"90vw"}
                    sx={{
                        minWidth: "80rem",
                        minHeight: "40rem",
                    }}
                >
                    <Box
                        bg={"white"}
                        h={"100%"}
                        display={"flex"}
                        sx={{
                            borderRadius: "20px",
                            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                            border: "1px solid #E5E7EB",
                        }}
                    >
                        <Box
                            bg={"white"}
                            sx={{
                                flexGrow: 1,
                                textAlign: "center",
                                borderRadius: "20px 0 0 20px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                src={illustration}
                                width={"45rem"}
                                mx={"auto"}
                                sx={{
                                    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                                    zIndex: 1,
                                    position: "absolute",
                                    minHeight: "30rem",
                                    minWidth: "40rem",
                                }}
                            />
                            <Box
                                sx={(theme) => ({
                                    backgroundImage: `linear-gradient(to bottom right, ${theme.colors.indigo[8]}, ${theme.colors.violet[2]})`,
                                    borderRadius: "44% 56% 69% 31% / 33% 39% 61% 67% ",
                                    width: "40rem",
                                    height: "30rem",
                                    position: "absolute",
                                    opacity: 0.8,
                                    zIndex: 0,
                                    minHeight: "30rem",
                                    minWidth: "40rem",
                                })}
                            ></Box>
                        </Box>
                        <Box
                            w={"40%"}
                            sx={{
                                borderRadius: "0 20px 20px 0",
                                textAlign: "center",
                                minWidth: "30rem",
                            }}
                        >
                            <Text
                                fz={"1.5rem"}
                                fw={600}
                                mt={"40%"}
                            >
                                ระบบแจ้งซ่อมออนไลน์
                            </Text>
                            <Container size={"60%"}>
                                <form
                                    onSubmit={form.onSubmit((values) => handleSubmit(values.user_id, values.password))}>
                                    <TextInput
                                        mt={"xl"}
                                        label="รหัสพนักงาน"
                                        icon={<IconUser/>}
                                        {...form.getInputProps('user_id')}
                                    />
                                    <PasswordInput
                                        mt={"sm"}
                                        label="รหัสผ่าน"
                                        icon={<IconKey/>}
                                        {...form.getInputProps('password')}

                                    />
                                    <Button
                                        mt={"xl"}
                                        type="submit"
                                        w={"80%"}
                                        loading={loading}
                                        variant="gradient"
                                        gradient={{from: "indigo", to: "cyan"}}
                                        leftIcon={<IconLogin/>}
                                    >
                                        {loading ? "กำลังเข้าสู่ระบบ" : "เข้าสู่ระบบ"}
                                    </Button>
                                </form>
                            </Container>
                        </Box>
                    </Box>
                </Container>
            </BackgroundImage>
        </Box>
    );
}
