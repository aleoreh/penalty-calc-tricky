import { useState } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function useModalForm() {
    const [isOpened, setIsOpened] = useState(false)
    return {
        isOpened,
        open: () => setIsOpened(true),
        close: () => setIsOpened(false),
        cancel: () => setIsOpened(false),
    }
}
