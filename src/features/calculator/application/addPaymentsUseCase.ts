import { AddPaymentsUseCase, CalculatorStoreRepo } from "../domain"
import calculatorShed from "../domain/calculator"
import paymentShed from "../domain/payment"

export function createAddPaymentsUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): AddPaymentsUseCase {
    return (paymentsData) => {
        const calculator = calculatorStoreRepo.getCalculator()

        const newPayments = paymentsData.map((x) =>
            paymentShed.init(x.date, x.amount, x.period)
        )

        const newCalculator =
            calculatorShed.addPayments(newPayments)(calculator)

        calculatorStoreRepo.setCalculator(newCalculator)
    }
}
