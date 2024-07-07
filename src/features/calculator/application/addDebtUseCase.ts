import { AddDebtUseCase, CalculatorStoreRepo } from "../domain"
import calculatorShed from "../domain/calculator"

export function createAddDebtUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): AddDebtUseCase {
    return async (debt) => {
        const calculator = await calculatorStoreRepo.getCalculator()

        const newCalculator = calculatorShed.addDebts([debt])(calculator)

        await calculatorStoreRepo.setCalculator(newCalculator)

        return newCalculator
    }
}
