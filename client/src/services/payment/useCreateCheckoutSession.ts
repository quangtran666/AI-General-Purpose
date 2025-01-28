import {useSession} from "next-auth/react";
import {useMutation} from "@tanstack/react-query";
import {CreateCheckoutSessionParams, paymentService} from "@/services/payment/payment-service";
import {setAuth} from "@/lib/axios";
import {useRouter} from "next/navigation";

export const useCreateCheckoutSession = () => {
    const { data: session } = useSession();
    const router = useRouter();
    
    const mutation = useMutation({
        mutationFn: async ({productId} : CreateCheckoutSessionParams) => {
            setAuth(session?.accessToken ?? "");
            return paymentService.createCheckoutSession({productId});
        },
        onSuccess: data => {
            console.log(data);
            router.push(data.data);
        },
        onError: error => {
            
        }
    })
    
    return {
        createCheckoutSession: mutation.mutateAsync,
        isLoading: mutation.isPending,
        error: mutation.error
    }
}