import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { handle } from "hono/vercel";


export const useConfirm = (title: string, message: string,): 
    [() => JSX.Element, () => Promise<unknown>] => {
        const [promise, setPromise] = useState<{resolve: (value: boolean) => void} | null>(null)

        const comfirm = () => new Promise((resolve, reject) => {
            setPromise({resolve})
        })

        const handleClose = () => {
            setPromise(null)
        }

        const handleConfirm = () => {
            promise?.resolve(true)
            handleClose()
        }

        const handleCancel = () => {
            promise?.resolve(false)
            handleClose()
        }   

        const ConfirmationDialog = () => (
            <Dialog open={promise !== null} onOpenChange={() => {}}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {title}
                        </DialogTitle>
                        <DialogDescription>
                            {message}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-2">
                        <Button onClick={handleCancel} variant={"outline"}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )

        return [ConfirmationDialog, comfirm]
}

