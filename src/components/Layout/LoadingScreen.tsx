import {Center, Container, Loader, Text} from "@mantine/core";

export const LoadingScreen = () => {
    return (
        <>
            <Container h={'100vh'} w={'100%'}>
                <Center h={'100vh'} w={'100%'} display={'flex'} sx={{
                    flexDirection: 'column',
                }}>
                    <Loader size={'lg'}/>
                    <Text mt={'xl'}
                          sx={{
                              display: 'inline-block',
                              clipPath: 'inset(0 3ch 0 0)',
                              animation: 'l 1s steps(4) infinite',

                              '@keyframes l': {
                                  'to': {
                                      clipPath: 'inset(0 -1ch 0 0)'
                                  }
                              }
                          }}
                    >กำลังออกจากระบบ&ensp;.&ensp;.&ensp;.
                    </Text>

                </Center>
            </Container>
        </>
    );
};
