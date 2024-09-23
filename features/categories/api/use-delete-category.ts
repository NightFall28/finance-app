import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

import { client } from "@/lib/hono"

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>

export const useDeleteCategory = (id?: string) => {
    const queryClient = useQueryClient()

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.categories[":id"]["$delete"]({
                param: {id}
            })

            if (!response.ok) {
                throw new Error(response.statusText)
            }

            return await response.json()
        },
        onSuccess: () => {
            toast.success('Category deleted')
            queryClient.invalidateQueries({queryKey: ['categories']})
            queryClient.invalidateQueries({queryKey: ['category', {id}]})
            queryClient.invalidateQueries({queryKey: ['transactions']})
        },
        onError: () => {
            toast.error('Failed to delete category')
        }
    })

    return mutation
}