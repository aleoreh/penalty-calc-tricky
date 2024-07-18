import { useApplication } from "./useApplication"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function useDebts() {
    const {
        calculator,
        dispatch,
        updateCalculatorDebt,
        getCalculatorDebt,
        addCalculatorDebt,
        addCalculatorDebts,
        deleteCalculatorDebt,
        clearCalculatorDebts,
    } = useApplication()

    const addDebt = (...params: Parameters<typeof addCalculatorDebt>) => {
        dispatch(() => addCalculatorDebt(...params))
    }

    const updateDebt = (...params: Parameters<typeof updateCalculatorDebt>) => {
        dispatch(() => updateCalculatorDebt(...params))
    }

    const deleteDebt = (...params: Parameters<typeof deleteCalculatorDebt>) => {
        dispatch(() => deleteCalculatorDebt(...params))
    }

    const addDebts = (...params: Parameters<typeof addCalculatorDebts>) => {
        dispatch(() => addCalculatorDebts(...params))
    }

    const clearDebts = (...params: Parameters<typeof clearCalculatorDebts>) => {
        dispatch(() => clearCalculatorDebts(...params))
    }

    return {
        debts: calculator.debts,
        getDebt: getCalculatorDebt,
        addDebt,
        addDebts,
        updateDebt,
        deleteDebt,
        clearDebts,
    }
}

