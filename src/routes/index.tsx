import { useEffect, useState } from "react";
import { useTheme, Box } from "native-base";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";

import { useAuth } from "../hooks/auth";

import { AuthRoutes } from "./auth.routes";
import { AppAdminRoutes } from "./app.admin.routes";
import { AppClubRoutes } from "./app.club.routes";
import { AppSponsorRoutes } from "./app.sponsor.routes";
import { AppConfectionRoutes } from "./app.confection.routes";

type User = {
  uid: string;
  emailVerified: boolean | null;
};

export function Routes() {
  const { user } = useAuth();
  const { colors } = useTheme();
  // const [user, setUser] = useState<User | null>(null);

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged((userInfo) => {
  //     setUser(userInfo);
  //   });

  //   return () => subscriber();
  // }, []);

  const renderUserRoutes = () => {
    // console.log(">>>> User: ", user);
    // console.log(">>>> Type: ", user.type);
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
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        {user ? renderUserRoutes() : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
