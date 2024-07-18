import { CalculatorStoreRepo, UpdateDebtUseCase } from "../domain"
import calculatorShed from "../domain/calculator"
import debtShed from "../domain/debt"

export function createUpdateDebtUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): UpdateDebtUseCase {
    return (params, debt) => {
        const calculator = calculatorStoreRepo.getCalculator()
        const newDebt = debtShed.updateDebt(params)(debt)
        const newCalculator = calculatorShed.updateDebt(newDebt)(calculator)
        calculatorStoreRepo.setCalculator(newCalculator)

        return newCalculator
    }
}

