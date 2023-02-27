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
    if (user && user.type === "admin") {
      return <AppAdminRoutes />;
    }

    if (user && user.type === "club") {
      return <AppClubRoutes />;
    }

    if (user && user.type === "sponsor") {
      return <AppSponsorRoutes />;
    }

    if (user && user.type === "confection") {
      return <AppConfectionRoutes />;
    }

    return <AuthRoutes />;
  };

  return (
    <Box flex={1} bg="gray.800">
      <NavigationContainer theme={theme}>
        {renderUserRoutes()}
      </NavigationContainer>
    </Box>
  );
}
