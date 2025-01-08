import { AuthOptions, getServerSession } from "next-auth"
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6";

const authOptions: AuthOptions = {
    providers: [
        DuendeIdentityServer6({
            id: process.env.DUENDE_ID,
            clientId: process.env.DUENDE_CLIENT_ID!,
            clientSecret: process.env.DUENDE_CLIENT_SECRET!,
            issuer: process.env.DUENDE_ISSUER!,
            authorization: {
                params: {
                    redirect_uri: process.env.DUENDE_REDIRECT_URL,
                    scope: "openid profile"
                }
            }
        })
    ],
    theme: {
        colorScheme: "light",
    },
    secret: process.env.NEXTAUTH_SECRET
}

const getSession = () => getServerSession(authOptions);

export { authOptions, getSession} 