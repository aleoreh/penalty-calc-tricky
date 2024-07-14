import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import { ReactNode } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

type AppDialogProps = {
    title: ReactNode
    isOpened: boolean
    onClose: () => void
    reset: () => void
    cancel: () => void
    submitAndContinue?: <T>(value: T) => void
    submit?: <T>(value: T) => void
    children: ReactNode
}

export function AppDialog({
    title,
    isOpened,
    onClose,
    reset,
    cancel,
    submitAndContinue,
    submit,
    children,
}: AppDialogProps) {
    return (
        <Dialog open={isOpened} onClose={onClose}>
            <Stack direction="row">
                <DialogTitle>{title}</DialogTitle>
                <Stack direction="row">
                    <Button onClick={reset}>сброс</Button>
                    <Button onClick={cancel}>отмена</Button>
                </Stack>
            </Stack>
            {children}
            <Stack direction="row">
                {submitAndContinue && (
                    <Button onClick={reset}>Применить и продолжить</Button>
                )}
                <Button onClick={submit}>Применить</Button>
            </Stack>
        </Dialog>
    )
}
