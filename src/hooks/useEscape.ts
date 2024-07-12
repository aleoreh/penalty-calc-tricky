import { useEffect } from "react"

type UseEscapeParams = {
    handleEscape: () => void
}

export function useEscape({ handleEscape }: UseEscapeParams) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            e.key === "Escape" && handleEscape()
        }

        document.addEventListener("keydown", handleEsc)
        return () => {
            document.removeEventListener("keydown", handleEsc)
        }
    }, [handleEscape])
}
