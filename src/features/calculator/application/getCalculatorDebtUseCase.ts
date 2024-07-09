import { CalculatorStoreRepo, GetCalculatorDebtUseCase } from "../domain"
import calculatorShed from "../domain/calculator"

export function createGetCalculatorDebtUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): GetCalculatorDebtUseCase {
    return (debtPeriod) => {
        const calculator = calculatorStoreRepo.getCalculator()
        return calculatorShed.getDebt(debtPeriod, calculator)
    }
}
