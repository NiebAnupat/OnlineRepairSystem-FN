import {Badge} from "@mantine/core";
import {StatusID, StatusName} from "@/models/Case";
import React from "react";

interface props {
    status_id: StatusID;
}

export const StatusBadge = ({status_id}: props) => {
    // return Chip different color based on statusID
    switch (status_id) {
        case StatusID.PENDING:
            return (
                <Badge color="yellow" size={'lg'}>
                    {StatusName.PENDING}
                </Badge>
            )
        case StatusID.IN_PROGRESS :
            return (
                <Badge color="indigo" size={'lg'}>
                    {StatusName.IN_PROGRESS}
                </Badge>
            )
        case StatusID.REPAIRING:
            return (
                <Badge color="blue" size={'lg'}>
                    {StatusName.REPAIRING}
                </Badge>
            )
        case StatusID.REPAIRED:
            return (
                <Badge color="green" size={'lg'}>
                    {StatusName.REPAIRED}
                </Badge>
            )
        default:
            return (
                <Badge color="dimmed" size={'lg'}>
                    {StatusName.UNKNOWN}
                </Badge>
            )
    }
};

export default StatusBadge;
