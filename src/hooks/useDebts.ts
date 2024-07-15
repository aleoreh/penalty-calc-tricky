import { useCalculator } from "./useCalculator"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function useDebts() {
    const {
        calculator,
        dispatch,
        updateCalculatorDebt,
        getCalculatorDebt,
        addCalculatorDebt,
    } = useCalculator()

    const addDebt = (...params: Parameters<typeof addCalculatorDebt>) => {
        dispatch(() => addCalculatorDebt(...params))
    }

    const updateDebt = (...params: Parameters<typeof updateCalculatorDebt>) => {
        dispatch(() => updateCalculatorDebt(...params))
    }

    return {
        debts: calculator.debts,
        getDebt: getCalculatorDebt,
        addDebt,
        updateDebt,
    }
}

