import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
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
    const formRef = useRef<HTMLFormElement | undefined>(undefined)

    const resetForm = () => {
        reset?.()
    }

    const closeForm = () => {
        reset?.()
        close()
    }

    const sumbitForm = (withContinue: boolean) => () => {
        close()
        reset?.()
        formRef.current?.reset()
        withContinue ? submitAndContinue?.() : submit?.()
    }

    return (
        <Dialog open={isOpened} onClose={closeForm}>
            <Box ref={formRef} onReset={resetForm} component="form">
                <Stack direction="column">
                    <Stack direction="row">
                        <DialogTitle>{title}</DialogTitle>
                        <Stack direction="row">
                            {reset && <Button type="reset">сброс</Button>}
                            {cancel && (
                                <Button type="button" onClick={cancel}>
                                    отмена
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                    {children}
                    <Stack direction="row">
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
                    </Stack>
                </Stack>
            </Box>
        </Dialog>
    )
}
