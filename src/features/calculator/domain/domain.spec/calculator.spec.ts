import { it } from "@fast-check/vitest"
import { pipe } from "@mobily/ts-belt"
import { describe, expect } from "vitest"
import billingPeriodShed from "../../../../lib/billing-period"
import kopekShed from "../../../../lib/kopek"
import { calculationResultItemsTotal } from "../calculation-result"
import calculatorShed from "../calculator"
import calculatorConfigShed from "../calculator-config"
import debtShed, { getDefaultDueDate } from "../debt"
import paymentShed, { Payment } from "../payment"
import { TheStateConstants } from "../types"

const theStateConstants: TheStateConstants = {
    daysToPay: 10,
    deferredDaysCount: 30,
    fractionChangeDay: 90,
    keyRates: [[new Date("1900-01-01"), 0.095]],
    moratoriums: [
        ["2020-04-06", "2021-01-01"],
        ["2022-03-31", "2022-10-01"],
    ],
}

const calculationDate = new Date("2024-04-19")
const debtPeriod = billingPeriodShed.fromDate(new Date("2019-05-01"))
const debtAmount = kopekShed.fromRuble(1000)

const naturalConfig = calculatorConfigShed.fromTheStateConstants(
    "natural",
    theStateConstants
)

const initialDebt = debtShed.initDebt(
    debtPeriod,
    getDefaultDueDate(debtPeriod, theStateConstants.daysToPay),
    debtAmount
)
const payments: Payment[] = [
    {
        id: paymentShed.numberToId(1),
        date: new Date("2020-01-01"),
        amount: kopekShed.fromRuble(100),
    },
]

const calculator = pipe(
    calculatorShed.init(calculationDate, naturalConfig, "fifo"),
    calculatorShed.addDebts([initialDebt]),
    calculatorShed.addPayments(payments)
)

describe("Калькулятор", () => {
    const startDebtAmount = initialDebt.amount
    const result = calculatorShed.calculate(calculator)
    const calculationResult = result[0]
    const startDebtResultItems = calculationResult.rows.filter(
        (row) => row.debtAmount === startDebtAmount
    )
    const one130DebtResultItems = calculationResult.rows.filter(
        (row) => row.ratePart.denominator === 130
    )

    const expected = {
        resultLength: 8,
        penaltyAmount: kopekShed.fromRuble(835.05),
        penaltyAmountOfStartDebt: kopekShed.fromRuble(103.04),
        penaltyAmountOfOne130: kopekShed.fromRuble(816.05),
    }

    it(`Количество строк расчета = ${expected.resultLength}`, () => {
        expect(calculationResult.rows.length).toEqual(expected.resultLength)
    })

    it(`Сумма пеней = ${kopekShed.toRuble(expected.penaltyAmount)}`, () => {
        expect(calculationResultItemsTotal(calculationResult.rows)).toBeCloseTo(
            expected.penaltyAmount,
            0
        )
    })

    it(`Сумма пеней по долгу ${kopekShed.toRuble(
        startDebtAmount
    )} = ${kopekShed.toRuble(expected.penaltyAmountOfStartDebt)}`, () => {
        expect(calculationResultItemsTotal(startDebtResultItems)).toBeCloseTo(
            expected.penaltyAmountOfStartDebt,
            0
        )
    })

    it(`Сумма пеней по доле 1/130 = ${kopekShed.toRuble(
        expected.penaltyAmountOfOne130
    )}`, () => {
        expect(calculationResultItemsTotal(one130DebtResultItems)).toBeCloseTo(
            expected.penaltyAmountOfOne130,
            0
        )
    })
})

