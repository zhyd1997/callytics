import { authClient } from "../auth-client";

export const signOut = async (onSuccess = () => {}) => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess,
    },
  });
}
