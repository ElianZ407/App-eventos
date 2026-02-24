"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2, AlertCircle } from "lucide-react"
import { useState } from "react"

interface ConfirmDeleteModalProps {
    title: string
    description: string
    onConfirm: () => void
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function ConfirmDeleteModal({ title, description, onConfirm, trigger, open, onOpenChange }: ConfirmDeleteModalProps) {
    const [internalOpen, setInternalOpen] = useState(false)

    const isControlled = open !== undefined
    const isOpen = isControlled ? open : internalOpen
    const setIsOpen = isControlled ? onOpenChange : setInternalOpen

    const handleConfirm = () => {
        onConfirm()
        if (setIsOpen) setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] border-destructive/20 p-0 overflow-hidden bg-background">
                <div className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-destructive/20 animate-ping opacity-25 rounded-full" />
                        <AlertCircle className="h-10 w-10 text-destructive relative z-10 animate-in zoom-in duration-500" />
                    </div>

                    <div className="space-y-2">
                        <DialogTitle className="text-xl font-bold text-foreground">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm px-4">
                            {description}
                        </DialogDescription>
                    </div>
                </div>

                <DialogFooter className="p-4 bg-secondary/30 flex gap-3 sm:gap-3 border-t">
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen && setIsOpen(false)}
                        className="flex-1 bg-background"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        className="flex-1 gap-2 shadow-lg shadow-destructive/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Trash2 className="h-4 w-4" />
                        Confirmar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
