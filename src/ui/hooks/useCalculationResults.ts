import { useState } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { CalculationResult } from "@/features/calculator/domain/calculation-result"
import { useApplication } from "./useApplication"
import { useDebts } from "./useDebts"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export { type CalculationResult }

export function useCalculationResults() {
    const [calculationResults, setCalculationResults] = useState<
        CalculationResult[]
    >([])

    const { runCalculation } = useApplication()

    const { debts } = useDebts()

    const calculationAllowed = debts.length > 0

    const calculate = () => {
        if (!calculationAllowed) return

        setCalculationResults(runCalculation())
    }

    const clearCalculationResults = () => {
        setCalculationResults([])
    }

    return {
        calculationAllowed,
        calculate,
        calculationResults,
        clearCalculationResults,
    }
}
