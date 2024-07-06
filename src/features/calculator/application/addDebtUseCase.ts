import { AddDebtUseCase, CalculatorStoreRepo } from "../domain"
import calculatorShed from "../domain/calculator"

export function createAddDebtUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): AddDebtUseCase {
    return async (debt, calculator) => {
        const newCalculator = calculatorShed.addDebts([debt])(calculator)

        await calculatorStoreRepo.setCalculator(newCalculator)
    }
}
