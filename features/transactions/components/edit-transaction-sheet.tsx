import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"


import { TransactionForm } from "./transaction-form";
import { insertTransactionSchema } from "@/db/schema";
import { z } from "zod";
import { useOpenTransaction } from "../hooks/use-open-transaction";
import { useGetTransaction } from "../api/use-get-transaction";
import { Loader2 } from "lucide-react";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useDeleteTransaction } from "../api/use-delete-transaction";
import { useConfirm } from "@/hooks/use-confirm";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { convertAmountFromMilliunits } from "@/lib/utils";

const formSchema = insertTransactionSchema.omit({
    id: true,
})

type FormValues = z.input<typeof formSchema>;

  export const EditTransactionSheet = () => {
    const { isOpen, onClose, id } = useOpenTransaction()
    const transactionQuery = useGetTransaction(id)
    const editMutation = useEditTransaction(id)
    const deleteMutation = useDeleteTransaction(id)

    const categoryMutation = useCreateCategory()
    const accountMutation = useCreateAccount()

    const categoryQuery = useGetCategories()
    const accountQuery = useGetAccounts()

    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id,
    }))

    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
    }))

    const onCreateCategory = (name: string) => categoryMutation.mutate({name})
    const onCreateAccount = (name: string) => accountMutation.mutate({name})
    
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure you want to delete this transaction?",
        "You are about to delete this transaction. This action cannot be undone.",
    )

    const isPending = 
        editMutation.isPending || 
        deleteMutation.isPending ||
        categoryMutation.isPending ||
        accountMutation.isPending

    const isLoading = 
        transactionQuery.isLoading ||
        categoryQuery.isLoading ||
        accountQuery.isLoading


    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose()
            },
        })
    }

    const onDelete = async () => {
        const ok = await confirm()

        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose()
                }
            })
        }
    }

    const defaultValues = transactionQuery.data ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: convertAmountFromMilliunits(transactionQuery.data.amount).toString(),
        date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
    } : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "",
    }

    return (
        <>
        <ConfirmDialog />
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        Edit Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Edit your existing transaction details.
                    </SheetDescription>
                </SheetHeader>
                {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>
                    ) : (
                        <TransactionForm
                            id={id}
                            defaultValues={defaultValues}
                            onSubmit={onSubmit}
                            onDelete={onDelete}
                            disabled={isPending}
                            categoryOptions={categoryOptions}
                            onCreateCategory={onCreateCategory}
                            accountOptions={accountOptions}
                            onCreateAccount={onCreateAccount}
                        />
                    )
                }
            </SheetContent>
        </Sheet>
        </>
    )
  }
  