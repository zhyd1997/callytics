import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
import { genericOAuthClient } from "better-auth/client/plugins"

export const authClient =  createAuthClient({
  //you can pass client configuration here
  plugins: [
    genericOAuthClient()
  ]
})
