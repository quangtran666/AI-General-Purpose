import {axiosInstance} from "@/lib/axios";

export type UserProfileDto = {
    email: string,
    fullName: string,
    subscription: SubscriptionDto,
}

export type SubscriptionDto = {
    subscriptionType: string,
    startDate: Date,
    endDate: Date,
    remainingUsage: number,
}

export const userService = {
    getUserProfile: async () => {
        return axiosInstance.get<UserProfileDto>(`/profile`)
    }
}