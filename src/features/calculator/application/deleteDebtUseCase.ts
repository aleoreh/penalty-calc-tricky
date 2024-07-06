import { CalculatorStoreRepo, DeleteDebtUseCase } from "../domain"
import calculatorShed from "../domain/calculator"

export function createDeleteDebtUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): DeleteDebtUseCase {
    return async (debtPeriod, calculator) => {
        const newCalculator = calculatorShed.deleteDebt(debtPeriod)(calculator)

        await calculatorStoreRepo.setCalculator(newCalculator)
    }
}
