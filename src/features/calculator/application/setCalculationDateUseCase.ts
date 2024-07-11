import { CalculatorStoreRepo, SetCalculationDateUseCase } from "../domain"
import calculatorShed from "../domain/calculator"

export function createSetCalculationDateUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): SetCalculationDateUseCase {
    return (calculationDate) => {
        const calculator = calculatorStoreRepo.getCalculator()
        const newCalculator =
            calculatorShed.setCalculationDate(calculationDate)(calculator)
        calculatorStoreRepo.setCalculator(newCalculator)
    }
}

