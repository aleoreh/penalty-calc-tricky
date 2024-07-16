import { useCalculator } from "./useCalculator"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function useDebts() {
    const {
        calculator,
        dispatch,
        updateCalculatorDebt,
        getCalculatorDebt,
        addCalculatorDebt,
        deleteCalculatorDebt,
    } = useCalculator()

    const addDebt = (...params: Parameters<typeof addCalculatorDebt>) => {
        dispatch(() => addCalculatorDebt(...params))
    }

    const updateDebt = (...params: Parameters<typeof updateCalculatorDebt>) => {
        dispatch(() => updateCalculatorDebt(...params))
    }

    const deleteDebt = (...params: Parameters<typeof deleteCalculatorDebt>) => {
        dispatch(() => deleteCalculatorDebt(...params))
    }

    return {
        debts: calculator.debts,
        getDebt: getCalculatorDebt,
        addDebt,
        updateDebt,
        deleteDebt,
    }
}

