import { CalculatorStoreRepo, GetCalculatorPaymentUseCase } from "../domain"
import calculatorShed from "../domain/calculator"

export function createGetCalculatorPaymentUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): GetCalculatorPaymentUseCase {
    return (id) => {
        const calculator = calculatorStoreRepo.getCalculator()
        return calculatorShed.getPayment(id, calculator)
    }
}
