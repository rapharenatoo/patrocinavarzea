import { useTheme, Box } from "native-base";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { useAuth } from "../hooks/auth";

import { AuthRoutes } from "./auth.routes";
import { AppAdminRoutes } from "./app.admin.routes";
import { AppClubRoutes } from "./app.club.routes";
import { AppSponsorRoutes } from "./app.sponsor.routes";
import { AppConfectionRoutes } from "./app.confection.routes";

export function Routes() {
  const { user } = useAuth();
  const { colors } = useTheme();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  const renderUserRoutes = () => {
    if (user.type === "admin") {
      return <AppAdminRoutes />;
    }

    if (user.type === "club") {
      return <AppClubRoutes />;
    }

    if (user.type === "sponsor") {
      return <AppSponsorRoutes />;
    }

    if (user.type === "confection") {
      return <AppConfectionRoutes />;
    }
  };

  return (
    <Box flex={1} bg="gray.800">
      <NavigationContainer theme={theme}>
        {user ? renderUserRoutes() : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
