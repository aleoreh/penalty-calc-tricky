import { useState } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { useApplication } from "../contexts/applicationContextHook"

export function useCalculator() {
    const { useCases } = useApplication()
    const [calculator, setCalculator] = useState(useCases.getCalculator())

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
