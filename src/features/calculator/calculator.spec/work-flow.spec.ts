import { it } from "@fast-check/vitest"
import { date, integer } from "fast-check"
import { beforeAll, describe, expect } from "vitest"
import { billingPeriodFromDate } from "../../../lib/billing-period"
import { numberAsKopek } from "../../../lib/kopek"
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
    noInvalidDate: true,
}).map(billingPeriodFromDate)
const amountArb = integer({ min: 0 }).map(numberAsKopek)
const dateArb = date({ min: new Date("1970-01-01"), noInvalidDate: true })

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

    it.prop([billingPeriodArb, integer().filter((x) => x >= 0), amountArb])(
        "позволяет добавлять долг в калькулятор",
        async (debtPeriod, daysToPay, debtAmount) => {
            const prevCalculator = calculatorStoreRepo.getCalculator()

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

    it.prop([dateArb, amountArb])(
        "позволяет изменить долг",
        (dueDate, amount) => {
            const prev = calculatorStoreRepo.getCalculator()
            const debt = prev.debts[0]
            useCases.updateCalculatorDebt({ dueDate, amount }, debt)
            const next = calculatorStoreRepo.getCalculator()

            expect(prev.debts[0].dueDate).toEqual(next.debts[0].dueDate)
            expect(prev.debts[0].amount).toEqual(next.debts[0].amount)
        }
    )
})
