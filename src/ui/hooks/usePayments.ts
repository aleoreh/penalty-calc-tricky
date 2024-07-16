import { useApplication } from "./useApplication"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function usePayments() {
    const {
        dispatch,
        calculator,
        addCalculatorPayment,
        deleteCalculatorPayment,
    } = useApplication()

    const addPayment = (...params: Parameters<typeof addCalculatorPayment>) => {
        dispatch(() => addCalculatorPayment(...params))
    }

    const deletePayment = (
        ...params: Parameters<typeof deleteCalculatorPayment>
    ) => {
        dispatch(() => deleteCalculatorPayment(...params))
    }

    return {
        payments: calculator.payments,
        addPayment,
        deletePayment,
    }
}
