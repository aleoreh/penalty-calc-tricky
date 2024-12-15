import { it } from "@fast-check/vitest"
import { describe, expect } from "vitest"
import { billingPeriodFromDate, billingPeriodsEqual } from "./billing-period"
import { date } from "fast-check"

const dateArb = date({
    noInvalidDate: true,
    min: new Date("1970-01-01"),
    max: new Date(),
})

describe("Billing period", () => {
    it.prop([dateArb])("конструируется из даты", (date) => {
        const res = billingPeriodFromDate(date)

        expect(res.getDate()).toStrictEqual(1)
    })

    it.prop([dateArb, dateArb])(
        "позволяет сравнивать два периода",
        (date1, date2) => {
            const period1 = billingPeriodFromDate(date1)
            const period2 = billingPeriodFromDate(date2)

            if (
                date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth()
            ) {
                expect(billingPeriodsEqual(period1, period2)).toBe(true)
            } else {
                expect(billingPeriodsEqual(period1, period2)).toBe(false)
            }
        }
    )
})
