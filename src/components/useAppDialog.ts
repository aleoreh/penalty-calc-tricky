import { useState } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

type Params = {
    reset: () => void
    submit?: <T>(value: T) => void
    submitAndContinue?: <T>(value: T) => void
}

export function useAppDialog({
    reset,
    submit,
    submitAndContinue,
}: Params) {
    const [isOpened, setIsOpened] = useState(false)
    return {
        isOpened,
        open: () => setIsOpened(true),
        onClose: () => setIsOpened(false),
        reset,
        cancel: () => setIsOpened(false),
        submit,
        submitAndContinue,
    }
}
