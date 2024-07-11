import { CalculatorStoreRepo, ClearPaymentsUseCase } from "../domain"
import calculatorShed from "../domain/calculator"

export function createClearPaymentsUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): ClearPaymentsUseCase {
    return () => {
        const calculator = calculatorStoreRepo.getCalculator()
        const newCalculator = calculatorShed.clearPayments(calculator)
        calculatorStoreRepo.setCalculator(newCalculator)
    }
}
