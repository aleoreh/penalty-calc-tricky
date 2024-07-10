import { CalculatorStoreRepo, UpdatePaymentUseCase } from "../domain"
import calculatorShed from "../domain/calculator"
import paymentShed from "../domain/payment"

export function createUpdatePaymentUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): UpdatePaymentUseCase {
    return (params, payment) => {
        const calculator = calculatorStoreRepo.getCalculator()
        const newPayment = paymentShed.update(params)(payment)
        const newCalculator = calculatorShed.setPayments([newPayment])(
            calculator
        )
        calculatorStoreRepo.setCalculator(newCalculator)
    }
}
