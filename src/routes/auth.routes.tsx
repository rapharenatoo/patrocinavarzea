import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { SignInClub } from "../screens/SignInClub";
import { SignInSponsor } from "../screens/SignInSponsor";
import { SignInConfection } from "../screens/SignInConfection";
import { SignInAdmin } from "../screens/SignInAdmin";
import { SignUp } from "../screens/SignUp";
import { LoginOptions } from "../screens/LoginOptions";
import { InitialTextClub } from "../screens/InitialTextClub";
import { InitialTextSponsor } from "../screens/InitialTextSponsor";
import { InitialTextConfection } from "../screens/InitialTextConfection";
import { EmailVerify } from "../screens/EmailVerify";
import { RetryEmailVerify } from "../screens/RetryEmailVerify";
import { ResetPassword } from "../screens/ResetPassword";

type AuthRoutes = {
  signInAdmin: undefined;
  signInClub: undefined;
  signInSponsor: undefined;
  signInConfection: undefined;
  signUp: undefined;
  loginOptions: undefined;
  initialTextClub: undefined;
  initialTextSponsor: undefined;
  initialTextConfection: undefined;
  emailVerify: undefined;
  retryEmailVerify: undefined;
  resetPassword: undefined;
};

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="loginOptions" component={LoginOptions} />
      <Screen name="signInAdmin" component={SignInAdmin} />
      <Screen name="signInClub" component={SignInClub} />
      <Screen name="signInSponsor" component={SignInSponsor} />
      <Screen name="signInConfection" component={SignInConfection} />
      <Screen name="signUp" component={SignUp} />
      <Screen name="initialTextClub" component={InitialTextClub} />
      <Screen name="initialTextSponsor" component={InitialTextSponsor} />
      <Screen name="initialTextConfection" component={InitialTextConfection} />
      <Screen name="emailVerify" component={EmailVerify} />
      <Screen name="retryEmailVerify" component={RetryEmailVerify} />
      <Screen name="resetPassword" component={ResetPassword} />
    </Navigator>
  );
}
