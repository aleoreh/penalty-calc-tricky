import { it } from "@fast-check/vitest"
import { date, integer } from "fast-check"
import { beforeAll, describe, expect } from "vitest"
import { billingPeriodFromDate } from "../../../lib/billing-period"
import daysShed from "../../../lib/days"
import { kopekAsNumber, numberAsKopek } from "../../../lib/kopek"
import { createCalculatorUseCases } from "../application"
import { createInitialiseCalculatorUseCase } from "../application/initialiseCalculatorUseCase"
import { CalculatorStoreRepo } from "../domain"
import { Calculator } from "../domain/calculator"
import { getDefaultDueDate } from "../domain/debt"
import userSettingsShed from "../domain/userSettings"
import { createCalculatorStoreSimpleRepo } from "../infrastructure/calculatorStoreSimpeRepo"
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

let calculator: Calculator
let calculatorStoreRepo: CalculatorStoreRepo
let useCases: ReturnType<typeof createCalculatorUseCases>

beforeAll(async () => {
    calculator = await theStateConstantsStaticRepo
        .getTheStateConstants()
        .then(createInitialiseCalculatorUseCase())
    calculatorStoreRepo = createCalculatorStoreSimpleRepo(calculator)
    useCases = createCalculatorUseCases(calculatorStoreRepo)
})

describe("Приложение", () => {
    it("инциализирует калькулятор при запуске", async () => {
        expect(calculator).haveOwnProperty("calculationDate")
    })

    it("хранит калькулятор в хранилище", () => {
        const savedCalculator = calculatorStoreRepo.getCalculator()

        expect(savedCalculator).toBe(calculator)
    })

    it.prop([billingPeriodArb, daysToPayArb, amountArb])(
        "позволяет добавлять долг в калькулятор",
        async (debtPeriod, daysToPay, debtAmount) => {
            const prevCalculator = calculatorStoreRepo.getCalculator()

            if (useCases.getDebt(debtPeriod) !== undefined) return

            const dueDate = getDefaultDueDate(debtPeriod, daysToPay)
            useCases.addDebt(debtPeriod, dueDate, debtAmount)

            const result = calculatorStoreRepo.getCalculator()

            expect(result.debts.length).toBe(prevCalculator.debts.length + 1)
        }
    )

    it("позволяет устанавливать в калькулятор пользовательские настройки", () => {
        const prev = calculatorStoreRepo.getCalculator()
        const userSettings = userSettingsShed.init()
        useCases.applyUserSettings(userSettings)
        const result = calculatorStoreRepo.getCalculator()

        expect(result.userSettings).toBe(prev.userSettings)
    })

    it.prop([dateArb])(
        "позволяет устанавливать дату расчёта",
        (calculationDate) => {
            useCases.setCalculationDate(calculationDate)
            const next = calculatorStoreRepo.getCalculator()

            expect(next.calculationDate).toEqual(calculationDate)
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

    it.prop([dateArb, amountArb, billingPeriodArb])(
        "позволяет добавить оплату",
        (date, amount, period) => {
            const prev = calculatorStoreRepo.getCalculator()
            useCases.addPayment(date, amount, period)
            const next = calculatorStoreRepo.getCalculator()

            expect(next.payments.length).toEqual(prev.payments.length + 1)
        }
    )

    it.prop([dateArb, amountArb, billingPeriodArb])(
        "позволяет изменить оплату",
        (date, amount, period) => {
            const prev = calculatorStoreRepo.getCalculator()
            const payment = prev.payments[0]
            useCases.updatePayment({ date, amount, period }, payment)
            const next = calculatorStoreRepo.getCalculator()

            expect(next.payments[0].amount).toEqual(next.payments[0].amount)
        }
    )
})

