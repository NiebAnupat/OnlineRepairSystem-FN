import Image from "@/models/Image";

enum StatusID {
    PENDING = 1,
    IN_PROGRESS = 2,
    REPAIRING = 3,
    REPAIRED = 4,
}

enum StatusName {
    PENDING = 'รอดำเนินการ',
    IN_PROGRESS = 'กำลังดำเนินการ',
    REPAIRING = 'กำลังซ่อม',
    REPAIRED = 'ซ่อมเสร็จแล้ว',
    UNKNOWN = 'เกิดข้อผิดพลาด',
}

const getStatusName = (status: StatusID): StatusName => {
    switch (status) {
        case StatusID.PENDING:
            return StatusName.PENDING;
        case StatusID.IN_PROGRESS:
            return StatusName.IN_PROGRESS;
        case StatusID.REPAIRING:
            return StatusName.REPAIRING;
        case StatusID.REPAIRED:
            return StatusName.REPAIRED;
        default :
            return StatusName.UNKNOWN;
    }
}

interface Status {
    status_id: StatusID;
    status_name: StatusName;
}

const getStatusColor = (status: string): string => {
    switch (status) {
        case StatusName.PENDING:
            return 'yellow';
        case StatusName.IN_PROGRESS:
            return 'blue';
        case StatusName.REPAIRING:
            return 'indigo';
        case StatusName.REPAIRED:
            return 'green';
        default :
            return 'gray';
    }
}

const getStatusColorByID = (status: StatusID): string => {
    switch (status) {
        case StatusID.PENDING:
            return 'yellow';
        case StatusID.IN_PROGRESS:
            return 'blue';
        case StatusID.REPAIRING:
            return 'indigo';
        case StatusID.REPAIRED:
            return 'green';
        default :
            return 'gray';
    }
}


interface Case {
    case_id: number;
    user_id: string;
    status_id: StatusID;
    tec_id: string | null;
    name_case: string;
    detail_case: string;
    place_case: string;
    date_case: Date;
    date_assign: Date | null;
    date_sent: Date | null;
    date_close: Date | null;
    images: Image[];
    statuses: Status;
    users_cases_tec_idTousers: {
        user_id: string;
        username: string;
    } | null;
    users_cases_user_idTousers: {
        user_id: string;
        username: string;
    };
}

interface LastCase {
    case_id: number;
    status_id: StatusID;
}

interface TecUpdateDUO {
    tec_id: string;
    status_id: number;
    date_assign?: string;
    date_sent?: string;
    date_close?: string;
}

export {StatusID, StatusName, getStatusColor, getStatusName, getStatusColorByID};
export type {LastCase,TecUpdateDUO};
export default Case;
