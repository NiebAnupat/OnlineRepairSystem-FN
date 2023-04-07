enum StatusID {
    PENDING = '1',
    IN_PROGRESS = '2',
    REPAIRING = '3',
    REPAIRED = '4',
}

enum StatusName {
    // [CaseStatusID.PENDING]: 'รอดำเนินการ';
    // [CaseStatusID.IN_PROGRESS]: 'กำลังดำเนินการ';
    // [CaseStatusID.REPAIRING]: 'กำลังซ่อม';
    // [CaseStatusID.REPAIRED]: 'ซ่อมเสร็จแล้ว';
    PENDING = 'รอดำเนินการ',
    IN_PROGRESS = 'กำลังดำเนินการ',
    REPAIRING = 'กำลังซ่อม',
    REPAIRED = 'ซ่อมเสร็จแล้ว',
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
    images: Buffer[];
}

interface LastCase {
    case_id: number;
    status_id: StatusID;
}

export {StatusID, StatusName};
export type {LastCase};
export default Case;
