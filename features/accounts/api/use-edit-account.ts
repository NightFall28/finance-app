import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

import { client } from "@/lib/hono"

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"]

export const useEditAccount = (id?: string) => {
    const queryClient = useQueryClient()

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.accounts[":id"]["$patch"]({
                json, 
                param: {id}
            })

            if (!response.ok) {
                throw new Error(response.statusText)
            }

            return await response.json()
        },
        onSuccess: () => {
            toast.success('Account updated')
            queryClient.invalidateQueries({queryKey: ['accounts']})
            queryClient.invalidateQueries({queryKey: ['account', {id}]})
        },
        onError: () => {
            toast.error('Failed to edit account')
        }
    })

    return mutation
}