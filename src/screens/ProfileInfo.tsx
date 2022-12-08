import { Center, Text, VStack } from "native-base";

import { HomeHeader } from "../components/Header";

export function ProfileInfo() {
  return (
    <VStack flex={1}>
      <HomeHeader />

      <Center flex={1}>
        <Text color="yellow.400"> ProfileInfo </Text>
      </Center>
    </VStack>
  );
}
