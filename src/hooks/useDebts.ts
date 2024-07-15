import { useCalculator } from "./useCalculator"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function useDebts() {
    const { calculator, dispatch, updateCalculatorDebt, getCalculatorDebt } =
        useCalculator()

    const updateDebt = (...params: Parameters<typeof updateCalculatorDebt>) => {
        dispatch(() => updateCalculatorDebt(...params))
    }

    return {
        debts: calculator.debts,
        getDebt: getCalculatorDebt,
        updateDebt,
    }
}
