import Case, {getStatusName, StatusID, StatusName, TecUpdateDUO} from "@/models/Case";
import {Button, Chip, Container, Divider, Flex, Group, Text} from "@mantine/core";
import StatusBadge from "@/components/helper/StatusBadge";
import React, { useState} from "react";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";
import useAxios from "@/lib/useAxios";
import moment from "moment";
import {AxiosError, AxiosResponse} from "axios";
import {initialCases} from "@/lib/caseStore";

interface props {
    selectedCase: Case;
    user_id: string;
}

const UpdateCaseStatus = ({selectedCase, user_id}: props) => {

        const [statusSelected, setStatusSelected] = useState<string>(selectedCase.status_id.toString());

        const updateStatus = async () => {
            const status_id = parseInt(statusSelected);

            try {

                const currentDate: string = moment().format('YYYY-MM-DD');

                let data: TecUpdateDUO = {
                    tec_id: user_id,
                    status_id: status_id,
                }


                switch (status_id) {
                    case StatusID.IN_PROGRESS :
                        data.date_assign = currentDate;
                        break;
                    case StatusID.REPAIRING :
                        data.date_sent = currentDate;
                        break;
                    case StatusID.REPAIRED :
                        data.date_close = currentDate;
                        break;
                }

                const res: AxiosResponse = await useAxios.put(`cases/${selectedCase.case_id}/tec`, data);

                if (res.status === 200) {
                    notifications.show({
                        title: 'อัพเดทสถานะสำเร็จ',
                        message: `อัพเดทสถานะเป็น ${getStatusName(status_id)} สำเร็จ`,
                        color: 'green',
                    })
                    initialCases();
                    modals.closeAll()
                }

            } catch (e) {
                if (e instanceof AxiosError) {

                    switch (e.response?.status) {
                        case 400: {
                            notifications.show({
                                    title: 'เกิดข้อผิดพลาด',
                                    message: 'สถานะไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง',
                                    color: 'red',
                                }
                            )
                        }
                            break;
                        case 404: {
                            notifications.show({
                                title: 'เกิดข้อผิดพลาด',
                                message: 'ไม่พบรายการนี้ กรุณาลองใหม่อีกครั้ง',
                                color: 'red',
                            })
                            break;
                        }
                        case 405 : {
                            notifications.show({
                                title: 'เกิดข้อผิดพลาด',
                                message: 'ไม่สามารถอัพเดทสถานะได้ เนื่องจากไม่ได้รับอนุญาต',
                                color: 'red',
                            })
                            break;
                        }
                        case 500: {
                            notifications.show({
                                title: 'เกิดข้อผิดพลาด',
                                message: 'เกิดข้อผิดพลาดบางประการ กรุณาลองใหม่อีกครั้ง',
                                color: 'red',
                            })
                            break;
                        }


                    }
                }
                notifications.show({
                    title: 'เกิดข้อผิดพลาด',
                    message: 'ไม่สามารถอัพเดทสถานะได้ กรุณาลองใหม่อีกครั้ง',
                    color: 'red',
                })
            }
        }

        return (
            <>
                <Container>
                    <Flex justify={'space-between'}>
                        <Text fz={'md'}>รายการหมายเลข : {selectedCase.case_id}</Text>
                        <Text fz={'md'} sx={{
                            alignContent: 'center',
                        }}>สถานะปัจจุบัน : <StatusBadge status_id={selectedCase.status_id}/></Text>
                    </Flex>
                    <Divider my={'lg'}/>
                    <Text align={'center'} fw={600}>เลือกสถานะ</Text>
                    <Chip.Group multiple={false} defaultValue={statusSelected} onChange={setStatusSelected}>
                        <Group mt={'lg'} position="center">
                            <Chip color={'indigo'} variant={'filled'} value={StatusID.IN_PROGRESS.toString()}
                            >{StatusName.IN_PROGRESS}</Chip>
                            <Chip color={'blue'} variant={'filled'} value={StatusID.REPAIRING.toString()}
                            >{StatusName.REPAIRING}</Chip>
                            <Chip color={'green'} variant={'filled'} value={StatusID.REPAIRED.toString()}
                            >{StatusName.REPAIRED}</Chip>
                        </Group>
                    </Chip.Group>

                    <Flex mt={'lg'} justify={'center'} gap={'md'}>
                        <Button color={'red'} size={'xs'} radius={'md'} variant={'outline'}
                                onClick={() => modals.closeAll()}>ยกเลิก</Button>
                        <Button color={'green'} size={'xs'} radius={'md'} variant={'gradient'}
                                gradient={{from: 'blue.5', to: 'violet.3'}} onClick={() => updateStatus()}>บันทึก</Button>
                    </Flex>
                </Container>
            </>
        );
    }
;

export default UpdateCaseStatus;
