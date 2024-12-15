import { CalculatorStoreRepo, AddDebtsUseCase } from "../domain"
import calculatorShed from "../domain/calculator"
import debtShed, { getDefaultDueDate } from "../domain/debt"

export function createAddDebtsUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): AddDebtsUseCase {
    return (debtsData) => {
        const calculator = calculatorStoreRepo.getCalculator()

        const newDebts = debtsData.map((x) =>
            debtShed.initDebt(
                x.period,
                getDefaultDueDate(x.period, calculator.config.daysToPay),
                x.amount
            )
        )

        const newCalculator = calculatorShed.addDebts(newDebts)(calculator)

        calculatorStoreRepo.setCalculator(newCalculator)
    }
}
