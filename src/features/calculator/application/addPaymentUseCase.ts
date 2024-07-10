import { AddPaymentUseCase, CalculatorStoreRepo } from "../domain"
import calculatorShed from "../domain/calculator"
import paymentShed from "../domain/payment"

export function createAddPaymentUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): AddPaymentUseCase {
    return (date, amount, period) => {
        const calculator = calculatorStoreRepo.getCalculator()
        const newPayment = paymentShed.init(date, amount, period)
        const newCalculator = calculatorShed.addPayments([newPayment])(
            calculator
        )
        calculatorStoreRepo.setCalculator(newCalculator)
    }
}

