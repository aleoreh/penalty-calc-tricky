import { pipe } from "@mobily/ts-belt"
import { CalculatorStoreRepo, SetCalculationDateUseCase } from "../domain"
import calculatorShed from "../domain/calculator"

export function createSetCalculationDateUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): SetCalculationDateUseCase {
    return (calculationDate) => {
        const calculator = calculatorStoreRepo.getCalculator()
        const newCalculator = pipe(
            calculator,
            calculatorShed.setCalculationDate(calculationDate)
        )
        calculatorStoreRepo.setCalculator(newCalculator)
    }
}

