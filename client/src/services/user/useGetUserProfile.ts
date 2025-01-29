import {useSession} from "next-auth/react";
import {useQuery} from "@tanstack/react-query";
import {setAuth} from "@/lib/axios";
import {userService} from "@/services/user/user-service";

export const useGetUserProfile = () => {
    const {data: session, status} = useSession()
    
    const query = useQuery({
        queryKey: ["user-profile"],
        queryFn: async () => {
            setAuth(session?.accessToken ?? "")
            return await userService.getUserProfile()
        },
        staleTime: Infinity,
        enabled: status === "authenticated",
        refetchOnMount: true
    })
    
    return {
        userInfo: query.data?.data,
        isLoading: query.isLoading,
        isError: query.isError
    }
}