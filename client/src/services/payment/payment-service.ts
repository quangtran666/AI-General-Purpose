import {axiosInstance} from "@/lib/axios";

export type CreateCheckoutSessionParams = {
    productId: string,
}

export const paymentService = {
    createCheckoutSession: async ({productId} : CreateCheckoutSessionParams) => {
        return axiosInstance.post<string>(`/payment/checkout-session`, {
            productId: productId
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}