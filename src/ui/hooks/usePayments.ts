import { useApplication } from "./useApplication"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function usePayments() {
    const { dispatch, calculator, addCalculatorPayment } = useApplication()

    const addPayment = (...params: Parameters<typeof addCalculatorPayment>) => {
        dispatch(() => addCalculatorPayment(...params))
    }

    return {
        payments: calculator.payments,
        addPayment,
    }
}
