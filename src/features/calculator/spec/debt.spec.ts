import billingPeriodShed, { BillingPeriod } from "@/lib/billing-period"
import kopekShed, { Kopek } from "@/lib/kopek"
import { it } from "@fast-check/vitest"
import { Arbitrary, date, integer } from "fast-check"
import { beforeEach, describe, expect } from "vitest"
import { createAddDebtUseCase } from "../application/addDebtUseCase"
import { createInitialiseCalculatorsUseCase } from "../application/initialiseCalculatorUseCase"
import { AddDebtUseCase, CalculatorStoreRepo } from "../domain"
import { getDefaultDueDate, initDebt } from "../domain/debt"
import { createCalculatorStoreSimpleRepo } from "../infrastructure/calculatorStoreSimpeRepo"
import { theStateConstantsStaticRepo as theStateConstantsRepo } from "../infrastructure/theStateConstantsStaticRepo"

const initialiseCalculator = createInitialiseCalculatorsUseCase(
    theStateConstantsRepo
)
const debtPeriodArb: Arbitrary<BillingPeriod> = date().map(
    billingPeriodShed.fromDate
)
const debtAmountArb: Arbitrary<Kopek> = integer().map(kopekShed.asKopek)

let addDebt: AddDebtUseCase
let calculatorStoreRepo: CalculatorStoreRepo

beforeEach(async () => {
    const calculator = await initialiseCalculator()

    calculatorStoreRepo = createCalculatorStoreSimpleRepo(calculator)

    addDebt = createAddDebtUseCase(calculatorStoreRepo)
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
})
