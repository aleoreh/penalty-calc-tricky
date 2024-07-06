import { CalculatorStoreRepo, ClearDebtsUseCase } from "../domain"
import calculatorShed from "../domain/calculator"

export function createClearDebtsUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): ClearDebtsUseCase {
    return async (calculator) => {
        const newCalculator = calculatorShed.clearDebts(calculator)

        await calculatorStoreRepo.setCalculator(newCalculator)
    }
}
