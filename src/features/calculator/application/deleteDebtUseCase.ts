import { CalculatorStoreRepo, DeleteDebtUseCase } from "../domain"
import calculatorShed from "../domain/calculator"

export function createDeleteDebtUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): DeleteDebtUseCase {
    return async (debtPeriod) => {
        const calculator = await calculatorStoreRepo.getCalculator()

        const newCalculator = calculatorShed.deleteDebt(debtPeriod)(calculator)

        await calculatorStoreRepo.setCalculator(newCalculator)

        return newCalculator
    }
}
