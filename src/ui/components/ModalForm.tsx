import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Dialog from "@mui/material/Dialog"
import Stack from "@mui/material/Stack"
import { ReactNode, useRef } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

type ModalFormProps = {
    title: ReactNode
    isOpened: boolean
    isValid?: boolean
    isInitial?: boolean
    close: () => void
    reset?: () => void
    cancel?: () => void
    submitAndContinue?: () => void
    submit?: () => void
    children: ReactNode
}

/**
 * Удобнее использовать вместе с `useModalForm` hook
 *
 * Для добавления валидации возьмите хуки `useValidatedForm` и `useValidatedInput`
 */
export function ModalForm({
    title,
    isOpened,
    isValid,
    isInitial,
    close,
    reset,
    cancel,
    submitAndContinue,
    submit,
    children,
}: ModalFormProps) {
    const formRef = useRef<HTMLFormElement | null>(null)

    const resetForm = () => {
        reset?.()
        formRef.current?.reset()
    }

    const sumbitForm = (withContinue: boolean) => () => {
        close()
        withContinue ? submitAndContinue?.() : submit?.()
    }

    return (
        <Dialog open={isOpened} onClose={close}>
            <Card ref={formRef} onReset={resetForm} component="form">
                <CardHeader
                    title={title}
                    action={
                        <Stack direction="row">
                            <Stack direction="row">
                                {reset && <Button type="reset">сброс</Button>}
                                {cancel && (
                                    <Button type="button" onClick={cancel}>
                                        отмена
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    }
                />
                <CardContent>{children}</CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                    {submitAndContinue && (
                        <Button
                            type="button"
                            disabled={isInitial || !isValid}
                            onClick={sumbitForm(true)}
                        >
                            Применить и продолжить
                        </Button>
                    )}
                    {submit && (
                        <Button
                            type="button"
                            disabled={isInitial || !isValid}
                            onClick={sumbitForm(false)}
                        >
                            Применить
                        </Button>
                    )}
                </CardActions>
            </Card>
        </Dialog>
    )
}

