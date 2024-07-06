import { CalculatorStoreRepo, SetCalculatorConfigUseCase } from "../domain"
import calculatorShed from "../domain/calculator"

export function createSetCalculatorConfigUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): SetCalculatorConfigUseCase {
    return async (calculatorConfig, calculator) => {
        const newCalculator =
            calculatorShed.setConfig(calculatorConfig)(calculator)

        calculatorStoreRepo.setCalculator(newCalculator)
    }
}
