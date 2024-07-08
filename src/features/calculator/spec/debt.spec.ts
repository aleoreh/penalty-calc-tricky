import { it } from "@fast-check/vitest"
import { Arbitrary, date, integer } from "fast-check"
import { beforeEach, describe, expect } from "vitest"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import billingPeriodShed, { BillingPeriod } from "@/lib/billing-period"
import kopekShed, { Kopek } from "@/lib/kopek"
import { createAddDebtUseCase } from "../application/addDebtUseCase"
import { createInitialiseCalculatorsUseCase } from "../application/initialiseCalculatorUseCase"
import domain, { AddDebtUseCase, CalculatorStoreRepo } from "../domain"
import { createCalculatorStoreSimpleRepo } from "../infrastructure/calculatorStoreSimpeRepo"
import { theStateConstantsStaticRepo as theStateConstantsRepo } from "../infrastructure/theStateConstantsStaticRepo"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

const debtPeriodArb: Arbitrary<BillingPeriod> = date().map(
    billingPeriodShed.fromDate
)
const debtAmountArb: Arbitrary<Kopek> = integer().map(kopekShed.asKopek)

const initialiseCalculator = createInitialiseCalculatorsUseCase(
    theStateConstantsRepo
)

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

            await addDebt(
                debtPeriod,
                domain.getDefaultDueDate(debtPeriod, debtAmount),
                debtAmount
            )

            const calculator = await calculatorStoreRepo.getCalculator()

            expect(calculator.debts.length).toEqual(
                prevCalculator.debts.length + 1
            )
        }
    )
})

