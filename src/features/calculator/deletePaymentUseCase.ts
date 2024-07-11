import { CalculatorStoreRepo, deletePaymentUseCase } from "./domain"
import calculatorShed from "./domain/calculator"

export function createDeletePaymentUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): deletePaymentUseCase {
    return (paymentId) => {
        const calculator = calculatorStoreRepo.getCalculator()
        const newCalculator =
            calculatorShed.deletePayment(paymentId)(calculator)
        calculatorStoreRepo.setCalculator(newCalculator)
    }
}
