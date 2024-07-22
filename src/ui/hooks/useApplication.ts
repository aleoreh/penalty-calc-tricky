import { useContext } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { ApplicationContext } from "../contexts/applicationContext"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function useApplication() {
    const { useCases, calculator, setCalculator } =
        useContext(ApplicationContext)

    const dispatch = (callback: () => void) => {
        callback()
        setCalculator(useCases.getCalculator())
    }

    return {
        calculator,
        dispatch,
        ...useCases,
    }
}

