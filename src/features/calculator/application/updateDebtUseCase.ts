import { CalculatorStoreRepo, UpdateDebtUseCase } from "../domain"
import calculatorShed from "../domain/calculator"
import debtShed from "../domain/debt"

export function createUpdateDebtUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): UpdateDebtUseCase {
    return async (params, debt) => {
        const calculator = await calculatorStoreRepo.getCalculator()

        const newDebt = debtShed.updateDebt(params)(debt)

        const newCalculator = calculatorShed.updateDebt(newDebt)(calculator)

        await calculatorStoreRepo.setCalculator(newCalculator)

        return newCalculator
    }
}
