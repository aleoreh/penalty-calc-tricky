import { CalculatorStoreRepo, GetPaymentUseCase } from "../domain"
import calculatorShed from "../domain/calculator"

export function createGetPaymentUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): GetPaymentUseCase {
    return (id) => {
        const calculator = calculatorStoreRepo.getCalculator()
        return calculatorShed.getPayment(id, calculator)
    }
}
