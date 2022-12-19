import { Platform } from "react-native";
import { useTheme } from "native-base";
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";

import { Home } from "../screens/Home";
import { Profile } from "../screens/Profile";
import { ChampionshipsList } from "../screens/ChampionshipsList";
import { Championship } from "../screens/Championship";

import HomeSvg from "../assets/home.svg";
import HistorySvg from "../assets/history.svg";
import ProfileSvg from "../assets/profile.svg";
import ListSvg from "../assets/list.svg";
import AddSvg from "../assets/add.svg";

type AppSponsorRoutes = {
  home: undefined;
  profile: undefined;
  championshipsList: undefined;
  clubList: undefined;
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppSponsorRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppSponsorRoutes>();

export function AppSponsorRoutes() {
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
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
      <Screen
        name="championshipsList"
        component={ChampionshipsList}
        options={{
          tabBarIcon: ({ color }) => (
            <ListSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
      <Screen
        name="clubList"
        component={Championship}
        options={{
          tabBarButton: () => null,
          tabBarIcon: ({ color }) => (
            <AddSvg fill={color} width={iconSize} height={iconSize} />
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
