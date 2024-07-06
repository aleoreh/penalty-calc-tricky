import { CalculatorStoreRepo, UpdateDebtUseCase } from "../domain"
import calculatorShed from "../domain/calculator"

export function createUpdateDebtUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): UpdateDebtUseCase {
    return async (debt, calculator) => {
        const newCalculator = calculatorShed.updateDebt(debt)(calculator)

        await calculatorStoreRepo.setCalculator(newCalculator)
    }
}
