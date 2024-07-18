import { CalculatorStoreRepo, GetDebtUseCase } from "../domain"
import calculatorShed from "../domain/calculator"

export function createGetDebtUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): GetDebtUseCase {
    return (debtPeriod) => {
        const calculator = calculatorStoreRepo.getCalculator()
        return calculatorShed.getDebt(debtPeriod, calculator)
    }
}
