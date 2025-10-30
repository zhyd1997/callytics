import { PROVIDER_ID } from "@/constants/oauth";
import { authClient } from "../auth-client";

export const signIn = async () => {
  const { data, error } = await authClient.signIn.oauth2({
    providerId: PROVIDER_ID, // required
    // callbackURL: "/dashboard",
    // errorCallbackURL: "/error-page",
    // newUserCallbackURL: "/welcome",
    // disableRedirect: false,
    // scopes: ["my-scope"],
    // requestSignUp: false,
  });

  return { data, error }
}