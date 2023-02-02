import { FormAdmin } from "../components/FormAdmin";
import { FormClub } from "../components/FormClub";
import { FormSponsor } from "../components/FormSponsor";
import { FormConfection } from "../components/FormConfection";

import { useAuth } from "../hooks/auth";

export function Profile() {
  const { user } = useAuth();

  const renderUserForm = () => {
    if (user.type === "admin") {
      return <FormAdmin />;
    }

    if (user.type === "club") {
      return <FormClub />;
    }

    if (user.type === "sponsor") {
      return <FormSponsor />;
    }

    if (user.type === "confection") {
      return <FormConfection />;
    }
  };

  return <>{renderUserForm()}</>;
}
