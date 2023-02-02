import { VStack } from "native-base";

import { Header } from "../components/Header";
import { InfoAdmin } from "../components/InfoAdmin";
import { InfoClub } from "../components/InfoClub";
import { InfoSponsor } from "../components/InfoSponsor";
import { InfoConfection } from "../components/InfoConfection";

import { useAuth } from "../hooks/auth";

export function Home() {
  const { user } = useAuth();

  const renderUserInfo = () => {
    if (user.type === "admin") {
      return <InfoAdmin />;
    }

    if (user.type === "club") {
      return <InfoClub />;
    }

    if (user.type === "sponsor") {
      return <InfoSponsor />;
    }

    if (user.type === "confection") {
      return <InfoConfection />;
    }
  };

  return (
    <VStack flex={1}>
      <Header />
      {renderUserInfo()}
    </VStack>
  );
}
