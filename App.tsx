import { StatusBar } from "react-native";
import { NativeBaseProvider } from "native-base";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

import { THEME } from "./src/theme";

import { Loading } from "./src/components/Loading";

import { SignIn } from "./src/screens/SignIn";
import { SignUp } from "./src/screens/SignUp";
import { LoginOptions } from "./src/screens/LoginOptions";
import { InitialTextClub } from "./src/screens/InitialTextClub";
import { InitialTextSponsor } from "./src/screens/InitialTextSponsor";
import { InitialTextConfection } from "./src/screens/InitialTextConfection";
import { EmailVerify } from "./src/screens/EmailVerify";
import { RetryEmailVerify } from "./src/screens/RetryEmailVerify";
import { ResetPassword } from "./src/screens/ResetPassword";

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {fontsLoaded ? <LoginOptions /> : <Loading />}
    </NativeBaseProvider>
  );
}
