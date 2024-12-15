import { useApplication } from "./useApplication"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function usePayments() {
    const {
        dispatch,
        calculator,
        addCalculatorPayment,
        addCalculatorPayments,
        deleteCalculatorPayment,
        updateCalculatorPayment,
        clearCalculatorPayments,
    } = useApplication()

    const addPayment = (...params: Parameters<typeof addCalculatorPayment>) => {
        dispatch(() => addCalculatorPayment(...params))
    }

    const deletePayment = (
        ...params: Parameters<typeof deleteCalculatorPayment>
    ) => {
        dispatch(() => deleteCalculatorPayment(...params))
    }

    const updatePayment = (
        ...params: Parameters<typeof updateCalculatorPayment>
    ) => {
        dispatch(() => updateCalculatorPayment(...params))
    }

    const addPayments = (
        ...params: Parameters<typeof addCalculatorPayments>
    ) => {
        dispatch(() => addCalculatorPayments(...params))
    }

    const clearPayments = (
        ...params: Parameters<typeof clearCalculatorPayments>
    ) => {
        dispatch(() => clearCalculatorPayments(...params))
    }

    return {
        payments: calculator.payments,
        addPayment,
        addPayments,
        deletePayment,
        updatePayment,
        clearPayments,
    }
}
