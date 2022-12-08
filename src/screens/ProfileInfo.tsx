import { Center, Text, VStack } from "native-base";

import { Header } from "../components/Header";
import { InfoClub } from "../components/InfoClub";
import { InfoSponsor } from "../components/InfoSponsor";
import { InfoConfection } from "../components/InfoConfection";
import { InfoAdmin } from "../components/InfoAdmin";

export function ProfileInfo() {
  return (
    <VStack flex={1}>
      <Header />
      <InfoAdmin />
    </VStack>
  );
}
