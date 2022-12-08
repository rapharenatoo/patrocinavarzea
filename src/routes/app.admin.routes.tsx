import { Platform } from "react-native";
import { useTheme } from "native-base";
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";

import { ProfileInfo } from "../screens/ProfileInfo";
import { Profile } from "../screens/Profile";
import { ChampionshipsList } from "../screens/ChampionshipsList";
import { Championship } from "../screens/Championship";

import HomeSvg from "../assets/home.svg";
import HistorySvg from "../assets/history.svg";
import ProfileSvg from "../assets/profile.svg";

type AppAdminRoutes = {
    profileInfo: undefined;
    profile: undefined;
    championshipsList: undefined;
    championship: undefined;
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppAdminRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppAdminRoutes>();

export function AppAdminRoutes() {
  const { sizes, colors } = useTheme();

  const iconSize = sizes[8];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.yellow[400],
        tabBarInactiveTintColor: colors.white,
        tabBarStyle: {
          backgroundColor: colors.gray[600],
          borderTopWidth: 0,
          height: Platform.OS === "android" ? "auto" : 96,
          paddingBottom: sizes[8],
          paddingTop: sizes[6],
        },
      }}
    >
      <Screen
        name="profileInfo"
        component={ProfileInfo}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
      <Screen
        name="championshipsList"
        component={ChampionshipsList}
        options={{
          tabBarIcon: ({ color }) => (
            <HistorySvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
      <Screen
        name="championship"
        component={Championship}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Navigator>
  );
}
