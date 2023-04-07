enum CaseStatus { 
    PENDING = 'รอดำเนินการ',
    IN_PROGRESS = 'กำลังดำเนินการ',
    REPAIRING = 'กำลังซ่อม',
    REPAIRED = 'ซ่อมเสร็จแล้ว',
}

interface Case{ }

interface LastCase {
    id: number;
    status: CaseStatus;
}

export { CaseStatus };
export type { LastCase };
export default Case;