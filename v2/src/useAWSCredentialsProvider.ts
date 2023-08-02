import { useContext, useMemo } from 'react'
import { fromWebToken,  } from "@aws-sdk/credential-providers";
import { AuthContext, IAuthContext } from "react-oauth2-code-pkce"
import { AwsCredentialIdentityProvider } from "@aws-sdk/types";

export default function useAWSCredentialsProvider(): AwsCredentialIdentityProvider {
  const { idToken } = useContext<IAuthContext>(AuthContext);
  if (!idToken) {
    throw new Error("unauthenticated!");
  }
  return useMemo(() => fromWebToken({
    roleArn: import.meta.env["VITE_ROLE_ARN"],
    webIdentityToken: idToken,
  }), [idToken]);
}