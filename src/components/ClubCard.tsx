import {
  Checkbox,
  Heading,
  HStack,
  Text,
  VStack,
  Link,
  ICheckboxGroupProps,
} from "native-base";

type ClubCard = ICheckboxGroupProps & {
  idCheckBox: string;
  name: string;
  taxId: string;
  address: {
    zipCode: string;
    street: string;
    neighborhood: string;
    state: string;
    city: string;
  };
  numberAddress: string;
  zone: string;
  instagram: string;
  facebook: string;
  foundationDate: string;
  clubColors: string;
  categoryJuvenile: boolean;
  categorySport: boolean;
  categoryVeteran: boolean;
  categoryFemale: boolean;
  wantSponsorship: string;
  isSponsorship: string;
  ownField: string;
};

export function ClubCard({
  idCheckBox,
  name,
  taxId,
  address,
  zone,
  instagram,
  facebook,
  foundationDate,
  clubColors,
  categoryJuvenile,
  categorySport,
  categoryVeteran,
  categoryFemale,
  wantSponsorship,
  isSponsorship,
  ownField,
  ...rest
}: ClubCard) {
  return (
    <VStack px={5} py={4} mt={3} bg="gray.600" rounded="md">
      <HStack>
        <Heading
          flex={1}
          pr={2}
          color="yellow.400"
          fontSize="lg"
          textTransform="capitalize"
          numberOfLines={1}
          fontFamily="heading"
          mb={1}
        >
          {name}
        </Heading>
        <Checkbox.Group accessibilityLabel="Patrocinar" {...rest}>
          <Checkbox
            colorScheme="yellow"
            size="sm"
            defaultIsChecked={false}
            accessibilityLabel="selecionar para patrocinar"
            value={idCheckBox}
          />
        </Checkbox.Group>
      </HStack>

      <Text color="gray.100" fontSize="sm" numberOfLines={2} mt={2}>
        CPF / CPNJ: {taxId}
      </Text>

      <Text color="gray.100" fontSize="sm" numberOfLines={2} mt={2}>
        {address.city} - {address.state}
      </Text>
      <Text color="gray.100" fontSize="sm" numberOfLines={1}>
        Região: {zone}
      </Text>

      <Text color="gray.100" fontSize="sm" numberOfLines={1} mt={2}>
        Cores: {clubColors}
      </Text>
      <Text color="gray.100" fontSize="sm" numberOfLines={1}>
        Categoria: {categoryJuvenile ? "Juvenil   " : ""}
        {categorySport ? "Sport   " : ""}
        {categoryVeteran ? "Veterano   " : ""}
        {categoryFemale ? "Female   " : ""}
      </Text>

      <Text color="gray.100" fontSize="sm" numberOfLines={1} mt={2}>
        Data da fundação: {foundationDate}
      </Text>
      <Text color="gray.100" fontSize="sm" numberOfLines={1}>
        Quer Patrocínio: {wantSponsorship}
      </Text>
      <Text color="gray.100" fontSize="sm" numberOfLines={1}>
        Patrocinado: {isSponsorship}
      </Text>
      <Text color="gray.100" fontSize="sm" numberOfLines={1}>
        Campo próprio: {ownField}
      </Text>

      <HStack mt={2} h={5}>
        <Text color="gray.100" fontSize="sm">
          Instagram:{" "}
        </Text>
        <Link
          href={`https://www.instagram.com/${instagram}`}
          _text={{
            color: "gray.100",
            size: "sm",
            fontWeight: "bold",
          }}
        >
          {instagram}
        </Link>
      </HStack>

      <HStack mt={2} h={5}>
        <Text color="gray.100" fontSize="sm">
          Facebook:{" "}
        </Text>
        <Link
          href={`https://www.facebook.com/${facebook}`}
          _text={{
            color: "gray.100",
            size: "sm",
            fontWeight: "bold",
          }}
        >
          {facebook}
        </Link>
      </HStack>
    </VStack>
  );
}
