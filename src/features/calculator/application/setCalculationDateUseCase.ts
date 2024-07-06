import { CalculatorStoreRepo, SetCalculationDateUseCase } from "../domain"
import calculatorShed from "../domain/calculator"

export function createSetCalculationDateUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): SetCalculationDateUseCase {
    return async (calculationDate, calculator) => {
        const newCalculator =
            calculatorShed.setCalculationDate(calculationDate)(calculator)

        await calculatorStoreRepo.setCalculator(newCalculator)
    }
}
