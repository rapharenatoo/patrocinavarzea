import { VStack, Text } from "native-base";

import { FormChampionship } from "../components/FormChampionship";
import { ScreenHeader } from "../components/ScreenHeader";

export function Championship() {
  return (
    <VStack flex={1}>
      <ScreenHeader title="Cadastrar Campeonato"/>
      <FormChampionship />
    </VStack>
  );
}
