import { useContext } from "react"
import { ApplicationContext } from "./applicationContext"

export function useApplication() {
    const { useCases } = useContext(ApplicationContext)
    return {
        useCases,
    }
}

