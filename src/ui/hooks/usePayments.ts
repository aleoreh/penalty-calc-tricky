import { useCalculator } from "./useCalculator"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function usePayments() {
    const { dispatch, calculator, addCalculatorPayment } = useCalculator()

    const addPayment = (...params: Parameters<typeof addCalculatorPayment>) => {
        dispatch(() => addCalculatorPayment(...params))
    }

    return {
        payments: calculator.payments,
        addPayment,
    }
}
