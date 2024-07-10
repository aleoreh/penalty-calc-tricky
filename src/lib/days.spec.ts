import { it } from "@fast-check/vitest"
import { Arbitrary, constant, date, oneof } from "fast-check"
import { describe, expect } from "vitest"
import {
    addDay,
    beginOfPeriod,
    compareDays,
    daysDiff,
    daysEqual,
    endOfPeriod,
} from "./days"

const dateArb = date({
    min: new Date("1970-01-01"),
    max: new Date(),
    noInvalidDate: true,
})
const periodPartArb: Arbitrary<"month" | "year"> = oneof(
    constant("month") as Arbitrary<"month">,
    constant("year") as Arbitrary<"year">
)

describe("days", () => {
    it.prop([dateArb, periodPartArb])(
        "вычисляет конец периода",
        (date, part) => {
            const res = endOfPeriod(date, part)
            const next = new Date(res)
            next.setDate(res.getDate() + 1)

            expect(res.getFullYear()).toEqual(date.getFullYear())
            if (part === "month") {
                expect(res.getMonth()).toEqual(date.getMonth())
            }
            expect(next.getDate()).toEqual(1)
        }
    )

    it.prop([dateArb, periodPartArb])(
        "вычисляет начало периода",
        (date, part) => {
            const res = beginOfPeriod(date, part)
            const next = new Date(res)
            next.setDate(res.getDate() - 1)

            expect(res.getFullYear()).toEqual(date.getFullYear())
            if (part === "month") {
                expect(res.getMonth()).toEqual(date.getMonth())
            }
            expect(res.getDate()).toEqual(1)
        }
    )

    it.prop([dateArb])("добавляет день", (date) => {
        const res = addDay(date)

        expect(res.getDate()).not.toEqual(date.getDate())
        expect(res.getTime() - date.getTime()).approximately(
            3600 * 24 * 1000,
            3600 * 1000
        )
    })

    it.prop([dateArb, dateArb])("сравнивает даты", (date1, date2) => {
        const res = compareDays(date1, date2)

        if (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getDate() === date2.getDate()
        ) {
            expect(res).toEqual("EQ")
        } else if (date1.getTime() < date2.getTime()) {
            expect(res).toEqual("LT")
        } else {
            expect(res).toEqual("GT")
        }
    })

    it.prop([dateArb, dateArb])(
        "вычисляет разницу в днях между датами",
        (date1, date2) => {
            const expectedRes = daysDiff(date1, date2)
            const check = addDay(date1, expectedRes)

            expect(
                daysEqual(check, date2),
                `expected that ${date1} + ${expectedRes} = ${date2}`
            ).toEqual(true)
        }
    )
})
