import billingPeriodShed, { BillingPeriod } from "@/lib/billing-period"
import kopekShed, { Kopek } from "@/lib/kopek"
import { it } from "@fast-check/vitest"
import { Arbitrary, date, integer } from "fast-check"
import { beforeEach, describe, expect } from "vitest"
import { createAddDebtUseCase } from "../application/addDebtUseCase"
import { createInitialiseCalculatorsUseCase } from "../application/initialiseCalculatorUseCase"
import {
    AddDebtUseCase,
    CalculatorStoreRepo,
    DeleteDebtUseCase,
} from "../domain"
import { getDefaultDueDate, initDebt } from "../domain/debt"
import { createCalculatorStoreSimpleRepo } from "../infrastructure/calculatorStoreSimpeRepo"
import { theStateConstantsStaticRepo as theStateConstantsRepo } from "../infrastructure/theStateConstantsStaticRepo"
import { createDeleteDebtUseCase } from "../application/deleteDebtUseCase"

const initialiseCalculator = createInitialiseCalculatorsUseCase(
    theStateConstantsRepo
)
const debtPeriodArb: Arbitrary<BillingPeriod> = date().map(
    billingPeriodShed.fromDate
)
const debtAmountArb: Arbitrary<Kopek> = integer().map(kopekShed.asKopek)

let addDebt: AddDebtUseCase
let deleteDebt: DeleteDebtUseCase
let calculatorStoreRepo: CalculatorStoreRepo

beforeEach(async () => {
    const calculator = await initialiseCalculator()

    calculatorStoreRepo = createCalculatorStoreSimpleRepo(calculator)

    addDebt = createAddDebtUseCase(calculatorStoreRepo)
    deleteDebt = createDeleteDebtUseCase(calculatorStoreRepo)
})

describe("Опериции с долгами", () => {
    it.prop([debtPeriodArb, debtAmountArb])(
        "Добавляет долг в калькулятор",
        async (debtPeriod, debtAmount) => {
            const prevCalculator = await calculatorStoreRepo.getCalculator()

            const debt = initDebt(
                debtPeriod,
                getDefaultDueDate(debtPeriod, prevCalculator.config.daysToPay),
                debtAmount
            )

            const prevDebtsLength = prevCalculator.debts.length

            const newCalculator = await addDebt(debt)

            expect(newCalculator.debts.length).toBe(prevDebtsLength + 1)
        }
    )

    it.prop([debtPeriodArb, debtAmountArb])(
        "Удаляет долг из калькулятора",
        async (debtPeriod, debtAmount) => {
            const prevCalculator = await calculatorStoreRepo.getCalculator()

            const debt = initDebt(
                debtPeriod,
                getDefaultDueDate(debtPeriod, prevCalculator.config.daysToPay),
                debtAmount
            )

            const calculatorWithDebt = await addDebt(debt)

            const newCalculator = await deleteDebt(
                calculatorWithDebt.debts[0].period
            )

            expect(newCalculator.debts.length).toEqual(
                calculatorWithDebt.debts.length
            )
        }
    )
})
