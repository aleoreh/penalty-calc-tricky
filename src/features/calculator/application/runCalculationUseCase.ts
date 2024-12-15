import { CalculatorStoreRepo, RunCalculationUseCase } from "../domain"
import calculatorShed from "../domain/calculator"

export function createRunCalculationUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): RunCalculationUseCase {
    return () => {
        const calculator = calculatorStoreRepo.getCalculator()
        return calculatorShed.calculate(calculator)
    }
}
