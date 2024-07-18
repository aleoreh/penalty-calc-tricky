import { CalculatorStoreRepo, SetKeyRateUseCase } from "../domain"
import calculatorShed from "../domain/calculator"

export function createSetCalculationKeyRateUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): SetKeyRateUseCase {
    return (keyRate) => {
        const calculator = calculatorStoreRepo.getCalculator()
        const newCalculator = calculatorShed.withKeyRate(keyRate)(calculator)
        calculatorStoreRepo.setCalculator(newCalculator)
    }
}
