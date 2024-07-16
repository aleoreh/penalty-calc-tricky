import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Dialog from "@mui/material/Dialog"
import { ReactNode } from "react"

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
                    <Button onClick={cancel}>
                        {cancelMessage || "Отмена"}
                    </Button>
                    <Button onClick={submitDialog}>
                        {submitMessage || "OK"}
                    </Button>
                </CardActions>
            </Card>
        </Dialog>
    )
}
