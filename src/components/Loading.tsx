import { Center, Spinner, Image } from "native-base";

import BackgroundImg from "../assets/background.png";

export function Loading() {
  return (
    <Center flex={1} bg="gray.700">
      <Image
        source={BackgroundImg}
        defaultSource={BackgroundImg}
        alt="Pessoas treinando"
        resizeMode="center"
        position="absolute"
      />
      <Spinner color="yellow.400" size={24}/>
    </Center>
  );
}
