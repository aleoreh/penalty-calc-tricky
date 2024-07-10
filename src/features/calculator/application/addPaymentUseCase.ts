import { AddPaymentUseCase, CalculatorStoreRepo } from "../domain"
import calculatorShed from "../domain/calculator"

export function createAddPaymentUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): AddPaymentUseCase {
    return (payment) => {
        const calculator = calculatorStoreRepo.getCalculator()
        const newCalculator = calculatorShed.addPayments([payment])(calculator)
        calculatorStoreRepo.setCalculator(newCalculator)
    }
}
