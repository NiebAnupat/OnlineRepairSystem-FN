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
}

interface LastCase {
    case_id: number;
    statuses: Status;
}

export {StatusID, StatusName, getStatusColor};
export type {LastCase};
export default Case;
