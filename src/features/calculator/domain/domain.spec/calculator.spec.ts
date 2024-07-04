import { it } from "@fast-check/vitest"
import { describe, expect } from "vitest"
import calculatorShed from "../calculator"
import calculatorConfigShed from "../calculator-config"
import * as data from "@/data"
import { pipe } from "@mobily/ts-belt"
import debtShed, { getDefaultDueDate } from "../debt"
import billingPeriodShed from "../../../../lib/billing-period"
import kopekShed from "../../../../lib/kopek"

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
const calculator = pipe(
    calculatorShed.init(calculationDate, naturalConfig, "fifo"),
    calculatorShed.addDebts([initialDebt])
)

describe("Калькулятор", () => {
    const result = calculatorShed.calculate(calculator)
    it("Что-то вычисляет", () => {
        expect(result[0].rows).toHaveLength(7)
    })
})
