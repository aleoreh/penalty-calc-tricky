import { CalculatorStoreRepo, ClearDebtsUseCase } from "../domain"
import calculatorShed from "../domain/calculator"

export function createClearDebtsUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): ClearDebtsUseCase {
    return (calculator) => {
        const newCalculator = calculatorShed.clearDebts(calculator)
        calculatorStoreRepo.setCalculator(newCalculator)
    }
}

