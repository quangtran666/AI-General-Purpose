import NextAuth from "next-auth"
import { authOptions } from "../../../../../auth";
import {JWT} from "next-auth/jwt";
import axios from "axios";

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }