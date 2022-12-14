import { useEffect, useState } from "react";
import { useTheme, Box } from "native-base";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";

import { AuthRoutes } from "./auth.routes";
import { AppAdminRoutes } from "./app.admin.routes";

type User = {
  uid: string;
  emailVerified: boolean | null;
};

export function Routes() {
  const { colors } = useTheme();
  const [user, setUser] = useState<User | null>(null);

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });

    return subscriber;
  }, []);

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        {user && user.emailVerified ? <AppAdminRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
