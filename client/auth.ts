import {AuthOptions, DefaultSession, getServerSession} from "next-auth"
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6";
import axios from "axios"
import {JWT} from "next-auth/jwt";

declare module "next-auth" {
    interface Account {
        access_token: string,
        refresh_token: string,
        expires_at: number,
    }

    interface Profile {
        given_name: string,
        family_name: string,
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
        refreshToken: string,
        accessTokenExpires: number,
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
            httpOptions: {
                timeout: 6000,
            },
            authorization: {
                params: {
                    redirect_uri: process.env.DUENDE_REDIRECT_URL,
                    scope: "openid profile offline_access identity backendapi.fullaccess"
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

                    console.log(res.data)

                    return res.data;
                }
            },
        })
    ],
    callbacks: {
        async session({session, token}) {
            // console.log("-----------Session---------------------")
            // console.log(session, token)
            session.accessToken = token.accessToken;
            session.user.userId = token.id;
            session.user.email = token.email;
            return session
        },
        async jwt({token, account, profile}) {
            // console.log("-----------JWT---------------------")
            // console.log(token, account, profile)
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpires = account.expires_at * 1000;
                token.id = profile?.sub;
                token.given_name = profile?.given_name;
                token.family_name = profile?.family_name;
                token.email = profile?.email;
            }
            
            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            return refreshAccessToken(token);
        }
    },
    theme: {
        colorScheme: "light",
    },
    secret: process.env.NEXTAUTH_SECRET
}

const getSession = () => getServerSession(authOptions);

async function refreshAccessToken(token: JWT) {
    try {
        const url = `${process.env.DUENDE_ISSUER}/connect/token`;

        const body = new URLSearchParams({
            client_id: process.env.DUENDE_CLIENT_ID!,
            client_secret: process.env.DUENDE_CLIENT_SECRET!,
            grant_type: "refresh_token",
            refresh_token: token.refreshToken
        });

        const response = await axios.post(url, body, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const refreshedToken = response.data;
        
        if (response.status != 200 ) throw refreshedToken;

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken // Fall back to old refresh token
        }
    } catch (error) {
        console.log(error)

        return {
            ...token,
            error: "RefreshAccessTokenError",
        }
    }
}

export {authOptions, getSession} 