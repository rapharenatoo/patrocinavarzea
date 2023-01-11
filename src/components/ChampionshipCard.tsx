import { Heading, HStack, Text, VStack } from "native-base";

type ChampionshipProps = {
  name: string;
  organizer: string;
  date: string;
  address: {
    zipCode: string;
    street: string;
    neighborhood: string;
    state: string;
    city: string;
  };
  numberAddress: string;
  zone: string;
  qtdTeams: string;
  instagram: string;
  cashReward: number;
  rewards: string;
  otherRewards?: string;
};

export function ChampionshipCard({
  name,
  organizer,
  date,
  address,
  numberAddress,
  zone,
  qtdTeams,
  instagram,
  cashReward,
  rewards,
  otherRewards,
}: ChampionshipProps) {
  return (
    <VStack px={5} py={4} mt={3} bg="gray.600" rounded="md">
      <Heading
        color="yellow.400"
        fontSize="lg"
        textTransform="capitalize"
        numberOfLines={1}
        fontFamily="heading"
        mb={1}
      >
        {name}
      </Heading>

      <Text color="gray.100" fontSize="sm" numberOfLines={1}>
        Organizador: {organizer}
      </Text>

      <Text color="gray.100" fontSize="sm" numberOfLines={2}>
        Dt de início: {date}
      </Text>
      <Text color="gray.100" fontSize="sm">
        Qtd Times: {qtdTeams}
      </Text>

      <Text color="gray.100" fontSize="sm" numberOfLines={1} mt={2}>
        CEP: {address.zipCode}
      </Text>
      <Text color="gray.100" fontSize="sm" numberOfLines={2}>
        End: {address.street}, {numberAddress}, {address.neighborhood}
      </Text>

      <Text color="gray.100" fontSize="sm" numberOfLines={1}>
        {address.city} - {address.state}
      </Text>

      <Text color="gray.100" fontSize="sm" numberOfLines={1}>
        Região: Zona {zone}
      </Text>

      <Text color="gray.100" fontSize="sm" numberOfLines={1} mt={2}>
        Instagram: {instagram}
      </Text>

      <Text color="gray.100" fontSize="sm" numberOfLines={1} mt={2}>
        Prêmio em dinheiro: R$ {cashReward},00
      </Text>

      <Text color="gray.100" fontSize="sm" numberOfLines={3} mt={2}>
        Outras premiações: {rewards}{!!otherRewards && `, ${otherRewards}`}
      </Text>

    </VStack>
  );
}
