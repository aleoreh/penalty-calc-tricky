import { AddDebtUseCase, CalculatorStoreRepo } from "../domain"
import calculatorShed from "../domain/calculator"
import debtShed from "../domain/debt"

export function createAddDebtUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): AddDebtUseCase {
    return async (debtPeriod, dueDate, debtAmount) => {
        const debt = debtShed.initDebt(debtPeriod, dueDate, debtAmount)

        const calculator = await calculatorStoreRepo.getCalculator()

        const newCalculator = calculatorShed.addDebts([debt])(calculator)

        await calculatorStoreRepo.setCalculator(newCalculator)
    }
}

