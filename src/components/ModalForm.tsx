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

    const onSumbit = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        close()
        reset?.()
        formRef.current?.reset()
        submitAndContinue ? submitAndContinue() : submit?.()
    }

    return (
        <Dialog open={isOpened} onClose={closeForm}>
            <Box
                ref={formRef}
                onReset={resetForm}
                onSubmit={onSumbit}
                component="form"
            >
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
                        <Button type="submit" disabled={isInitial || !isValid}>
                            Применить и продолжить
                        </Button>
                    )}
                    {submit && (
                        <Button type="submit" disabled={isInitial || !isValid}>
                            Применить
                        </Button>
                    )}
                </Stack>
            </Box>
        </Dialog>
    )
}
