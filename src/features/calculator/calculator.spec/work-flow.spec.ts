import { it } from "@fast-check/vitest"
import { Arbitrary, array, date, float, integer, record } from "fast-check"
import { beforeAll, describe, expect } from "vitest"
import { billingPeriodFromDate } from "../../../lib/billing-period"
import daysShed from "../../../lib/days"
import { kopekAsNumber, numberAsKopek } from "../../../lib/kopek"
import { createCalculatorUseCases } from "../application"
import { createInitialiseCalculatorUseCase } from "../application/initialiseCalculatorUseCase"
import { CalculatorStoreRepo } from "../domain"
import { Calculator, getKeyRate } from "../domain/calculator"
import { getDefaultDueDate } from "../domain/debt"
import { numberToPaymentId, Payment } from "../domain/payment"
import userSettingsShed, {
    withCalculationKeyRate,
} from "../domain/userSettings"
import { createCalculatorStoreReduxRepo } from "../infrastructure/calculatorStoreReduxRepo"
import theStateConstantsStaticRepo from "../infrastructure/theStateConstantsStaticRepo"

const billingPeriodArb = date({
    min: new Date("1970-01-01"),
    max: new Date(),
    noInvalidDate: true,
}).map(billingPeriodFromDate)
const amountArb = integer({ min: 0 }).map(numberAsKopek)
const dateArb = date({
    min: new Date("1970-01-01"),
    max: new Date(),
    noInvalidDate: true,
})
const daysToPayArb = integer({ min: 0, max: 10 })
const paymentArb: Arbitrary<Payment> = record({
    id: integer().map(numberToPaymentId),
    date: dateArb,
    amount: amountArb,
})
const paymentsArb = array(paymentArb, { minLength: 2 })
const keyRateArb = float({ noDefaultInfinity: true, noNaN: true })

let calculator: Calculator
let calculatorStoreRepo: CalculatorStoreRepo
let useCases: ReturnType<typeof createCalculatorUseCases>

beforeAll(async () => {
    calculator = await theStateConstantsStaticRepo
        .getTheStateConstants()
        .then(createInitialiseCalculatorUseCase())
    calculatorStoreRepo = createCalculatorStoreReduxRepo(calculator)
    useCases = createCalculatorUseCases(calculatorStoreRepo)
})

describe("Приложение", () => {
    it("возвращает новую ссылку при изменении", () => {
        const prev = calculatorStoreRepo.getCalculator()
        useCases.setCalculationDate(prev.calculationDate)
        const next = calculatorStoreRepo.getCalculator()

        expect(prev).toEqual(next)
        expect(prev).not.toBe(next)
    })

    it("инциализирует калькулятор при запуске", async () => {
        expect(calculator).haveOwnProperty("calculationDate")
    })

    it.prop([billingPeriodArb, daysToPayArb, amountArb])(
        "позволяет добавлять долг в калькулятор",
        async (debtPeriod, daysToPay, debtAmount) => {
            const prevCalculator = calculatorStoreRepo.getCalculator()

            if (useCases.getCalculatorDebt(debtPeriod) !== undefined) return

            const dueDate = getDefaultDueDate(debtPeriod, daysToPay)
            useCases.addCalculatorDebt(debtPeriod, dueDate, debtAmount)

            const result = calculatorStoreRepo.getCalculator()

            expect(result.debts.length).toBe(prevCalculator.debts.length + 1)
        }
    )

    it.prop([keyRateArb])(
        "позволяет устанавливать в калькулятор пользовательские настройки",
        (keyRate) => {
            const userSettings = withCalculationKeyRate(keyRate)(
                userSettingsShed.init()
            )
            useCases.applyUserSettings(userSettings)
            const result = calculatorStoreRepo.getCalculator()

            expect(result.userSettings).toEqual(userSettings)
        }
    )

    it.prop([dateArb])(
        "позволяет устанавливать дату расчёта",
        (calculationDate) => {
            useCases.setCalculationDate(calculationDate)
            const next = calculatorStoreRepo.getCalculator()

            expect(next.calculationDate).toEqual(calculationDate)
        }
    )

    it.prop([keyRateArb])(
        "позволяет устанавливать ключевую ставку",
        (keyRate) => {
            useCases.setCalculationKeyRate(keyRate)
            const next = calculatorStoreRepo.getCalculator()

            expect(getKeyRate(next, next.calculationDate)).toEqual(keyRate)
        }
    )

    it.prop([amountArb])("позволяет изменить долг", (amount) => {
        const prev = calculatorStoreRepo.getCalculator()
        const debt = prev.debts[0]
        const newDueDate = daysShed.add(debt.dueDate, 1)
        useCases.updateCalculatorDebt({ dueDate: newDueDate, amount }, debt)
        const next = calculatorStoreRepo.getCalculator()

        expect(next.debts[0].dueDate.getTime()).toEqual(newDueDate.getTime())
        expect(kopekAsNumber(next.debts[0].amount)).toEqual(
            kopekAsNumber(amount)
        )
    })

    it("позволяет удалить долг", () => {
        const prev = calculatorStoreRepo.getCalculator()
        const debt = prev.debts[0]
        useCases.deleteCalculatorDebt(debt.period)
        const next = calculatorStoreRepo.getCalculator()

        expect(next.debts.length).toEqual(prev.debts.length - 1)
    })

    it("позволяет очистить список долгов", () => {
        const prev = calculatorStoreRepo.getCalculator()
        useCases.clearCalculatorDebts()
        const next = calculatorStoreRepo.getCalculator()

        expect(
            prev.debts.length,
            "начальный список долгов был пустым"
        ).toBeGreaterThan(0)
        expect(next.debts.length).toEqual(0)
    })

    it.prop([dateArb, amountArb, billingPeriodArb])(
        "позволяет добавить оплату",
        (date, amount, period) => {
            const prev = calculatorStoreRepo.getCalculator()
            useCases.addCalculatorPayment(date, amount, period)
            const next = calculatorStoreRepo.getCalculator()

            expect(next.payments.length).toEqual(prev.payments.length + 1)
        }
    )

    it.prop([dateArb, amountArb, billingPeriodArb])(
        "позволяет изменить оплату",
        (date, amount, period) => {
            const prev = calculatorStoreRepo.getCalculator()
            const payment = prev.payments[0]
            useCases.updateCalculatorPayment({ date, amount, period }, payment)
            const next = calculatorStoreRepo.getCalculator()

            expect(next.payments[0].amount).toEqual(next.payments[0].amount)
        }
    )

    it("позволяет удалить оплату", () => {
        const prev = calculatorStoreRepo.getCalculator()
        const paymentToDelete = prev.payments[0]
        useCases.deleteCalculatorPayment(paymentToDelete.id)
        const next = calculatorStoreRepo.getCalculator()

        expect(next.payments.length).toEqual(prev.payments.length - 1)
    })

    it.prop([paymentsArb])("позволяет очистить список оплат", (payments) => {
        payments.forEach((payment) =>
            useCases.addCalculatorPayment(payment.date, payment.amount)
        )
        const prev = calculatorStoreRepo.getCalculator()
        useCases.clearCalculatorPayments()
        const next = calculatorStoreRepo.getCalculator()

        expect(
            prev.payments.length,
            "начальный список оплат был пустым"
        ).toBeGreaterThan(0)
        expect(next.payments.length).toEqual(0)
    })
})

