import { useApplication } from "./useApplication"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function usePayments() {
    const {
        dispatch,
        calculator,
        addCalculatorPayment,
        deleteCalculatorPayment,
        updateCalculatorPayment,
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

    return {
        payments: calculator.payments,
        addPayment,
        deletePayment,
        updatePayment,
    }
}
