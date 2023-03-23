import { Platform } from "react-native";
import { useTheme } from "native-base";
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";

import { Home } from "../screens/Home";
import { Profile } from "../screens/Profile";
import { ClubListConfection } from "../screens/ClubListConfection";
import { EmailSponsorConfection } from "../screens/EmailSponsorConfection";

import HomeSvg from "../assets/home.svg";
import HistorySvg from "../assets/history.svg";
import ProfileSvg from "../assets/profile.svg";
import ListSvg from "../assets/list.svg";
import AddSvg from "../assets/add.svg";
import CheckSvg from "../assets/checkbox.svg";

type AppConfectionRoutes = {
  home: undefined;
  profile: undefined;
  championshipsList: undefined;
  clubListConfection: undefined;
  emailSponsorConfection: undefined;
};

export type AppNavigatorRoutesProps =
  BottomTabNavigationProp<AppConfectionRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppConfectionRoutes>();

export function AppConfectionRoutes() {
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
      {/* <Screen
        name="championshipsList"
        component={ChampionshipsList}
        options={{
          tabBarIcon: ({ color }) => (
            <ListSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      /> */}
      <Screen
        name="clubListConfection"
        component={ClubListConfection}
        options={{
          tabBarIcon: ({ color }) => (
            <CheckSvg fill={color} width={iconSize} height={iconSize} />
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
      <Screen
        name="emailSponsorConfection"
        component={EmailSponsorConfection}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Navigator>
  );
}
