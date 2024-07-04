import * as data from "@/data"
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

const calculationDate = new Date("2024-04-19")
const debtPeriod = billingPeriodShed.fromDate(new Date("2019-05-01"))
const debtAmount = kopekShed.fromRuble(1000)

const naturalConfig = calculatorConfigShed.fromTheStateConstants(
    calculationDate,
    "natural",
    data
)

const initialDebt = debtShed.initDebt(
    debtPeriod,
    getDefaultDueDate(debtPeriod, data.daysToPay),
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
        (row) => (row.debtAmount = startDebtAmount)
    )
    const one130DebtResultItems = calculationResult.rows.filter(
        (row) => row.ratePart.denominator === 130
    )

    const expected = {
        resultLength: 8,
        penaltyAmount: kopekShed.fromRuble(835.05),
        penaltyAmountOfStartDebt: kopekShed.fromRuble(103.04),
        penaltyAmountOfOne130: calculationResultItemsTotal(
            one130DebtResultItems
        ),
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
})

