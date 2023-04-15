import React, {FunctionComponent, useEffect, useState} from 'react';
import Case, {getStatusColor} from "@/models/Case";
import {Badge, Card, Group, Image, Text, UnstyledButton} from "@mantine/core";
import {modals} from '@mantine/modals';
import {useInterval} from "@mantine/hooks";
import {BufferToBase64} from "@/lib/helper";

interface OwnProps {
    case: Case,
}

type Props = OwnProps;

const HistoryCard: FunctionComponent<Props> = (props) => {

    // card thumbnail

    const {images, name_case, statuses, case_id, place_case} = props.case;
    const [thumbnail, setThumbnail] = useState<Buffer>();

    const suffleImage = useInterval(() => {
        // suffle images every 5 seconds
        if (images.length > 0) {
            setThumbnail(images[Math.floor(Math.random() * images.length)].image);
        }
    }, 5000);

    useEffect(() => {
        suffleImage.start();
        return suffleImage.stop;
    }, [])

    useEffect(() => {
        setThumbnail(images[0].image)
    }, [images]);


    const getRandomPlaceColor = (): string => {
        const colors = ['green', 'blue', 'indigo', 'purple', 'pink', 'cyan', 'orange'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    const viewDetail = () => {
        modals.open({
            title: `รายละเอียดของ ${name_case}`,
            size: 'xl',
            padding: 'xl',
            radius: 'lg',
            shadow: 'md',
            children: (
                <Text>
                    asd
                </Text>
            ),

        });
    }


    return (
        <>
            <UnstyledButton sx={{
                "&:hover": {
                    transform: "translateY(-5px)",
                    transition: "all 0.2s ease-in-out",
                },
                transition: "transform 0.2s ease-in-out",
            }} onClick={viewDetail}
            >
                <Card shadow="sm" padding="lg" radius="md" sx={{
                    "&:hover": {
                        "boxShadow": "4px 12px 41px 0px rgba(50,0,150,0.1)"
                    },
                }}>
                    <Card.Section>
                        <Image
                            src={thumbnail && BufferToBase64(thumbnail)}
                            alt="Case thumbnail"
                            height={150}
                            withPlaceholder/>
                    </Card.Section>
                    <Group position="apart" mt="md" mb="xs">
                        <Text weight={600}>
                            {props.case.name_case}
                        </Text>
                        <Badge color="blue">รหัส: {case_id}</Badge>
                        <Badge
                            color={getStatusColor(statuses.status_name)}>สถานะ: {statuses.status_name}</Badge>
                        <Badge color={getRandomPlaceColor()}>สถานที่: {place_case}</Badge>
                    </Group>
                </Card>
            </UnstyledButton>
        </>
    );
};

export default HistoryCard;
