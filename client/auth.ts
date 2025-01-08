import {AuthOptions, DefaultSession, getServerSession} from "next-auth"
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6";
import axios from "axios"

declare module "next-auth" {
    interface Account {
        access_token: string,
    }
    interface Profile {
        given_name: string,
        family_name: string
    }
    interface Session extends DefaultSession {
        user: DefaultSession['user'] & {
            userId: string | undefined,
        },
        accessToken: string | undefined
    } 
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken: string,
        id: string | undefined
    }
}

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
            },
            userinfo: {
                url: process.env.DUENDE_USER_INFO_URL,
                async request(context) {
                    const res = await axios.get(process.env.DUENDE_USER_INFO_URL!, {
                        headers: {
                            Authorization: `Bearer ${context.tokens.access_token}`
                        }
                    });

                    return res.data;
                }
            },
        })
    ],
    callbacks: {
        async session({ session, token }) {
            // console.log("-----------Session---------------------")
            // console.log(session, token)
            session.accessToken = token.accessToken;
            session.user.userId = token.id;
            return session
        },
        async jwt({ token, account, profile }) {
            // console.log("-----------JWT---------------------")
            // console.log(token, account, profile)
            if (account) {
                token.accessToken = account.access_token;
                token.id = profile?.sub;
                token.given_name = profile?.given_name;
                token.family_name = profile?.family_name;
            }
            return token
        }
    },
    theme: {
        colorScheme: "light",
    },
    secret: process.env.NEXTAUTH_SECRET
}

const getSession = () => getServerSession(authOptions);

export { authOptions, getSession} 