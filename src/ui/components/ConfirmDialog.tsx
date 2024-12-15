import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Dialog,
} from "@mui/material"
import { ReactNode } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { DestructiveButton } from "./DestructiveButton"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

type ModalConfirmDialogProps = {
    title: ReactNode
    isOpened: boolean
    close: () => void
    submit: () => void
    submitMessage?: string
    cancel?: () => void
    cancelMessage?: string
    children?: ReactNode
}

export function ModalConfirmDialog({
    title,
    isOpened,
    close,
    submit,
    submitMessage,
    cancel,
    cancelMessage,
    children,
}: ModalConfirmDialogProps) {
    const submitDialog = () => {
        close()
        submit()
    }

    return (
        <Dialog open={isOpened} onClose={close}>
            <Card>
                <CardHeader title={title}></CardHeader>
                {children && <CardContent>{children}</CardContent>}
                <CardActions sx={{ justifyContent: "flex-end" }}>
                    <DestructiveButton onClick={submitDialog}>
                        {submitMessage || "OK"}
                    </DestructiveButton>
                    <Button onClick={cancel}>
                        {cancelMessage || "Отмена"}
                    </Button>
                </CardActions>
            </Card>
        </Dialog>
    )
}
