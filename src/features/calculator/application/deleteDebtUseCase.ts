import { CalculatorStoreRepo, DeleteDebtUseCase } from "../domain"
import calculatorShed from "../domain/calculator"

export function createDeleteDebtUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): DeleteDebtUseCase {
    return async (debtPeriod) => {
        const calculator = calculatorStoreRepo.getCalculator()
        const newCalculator = calculatorShed.deleteDebt(debtPeriod)(calculator)
        calculatorStoreRepo.setCalculator(newCalculator)
    }
}

