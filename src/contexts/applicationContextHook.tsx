import { useContext } from "react"
import { ApplicationContext } from "./applicationContext"

export function useApplicationContext() {
    const { calculatorApplication } = useContext(ApplicationContext)
    return {
        app: calculatorApplication,
    }
}
