import Opaque, { create, widen } from "ts-opaque"
import daysShed, { beginOfPeriod } from "./days"

export type BillingPeriod = Opaque<Date, "BillingPeriod">

export function billingPeriodFromDate(
    anyDateWithinPeriod: Date
): BillingPeriod {
    return create(beginOfPeriod(anyDateWithinPeriod, "month"))
}

export function billingPeriodsEqual(
    period1: BillingPeriod,
    period2: BillingPeriod
): boolean {
    return (
        daysShed.beginOfPeriod(widen(period1), "month") ===
        daysShed.beginOfPeriod(widen(period2), "month")
    )
}

export const billingPeriodShed = {
    fromDate: billingPeriodFromDate,
    equal: billingPeriodsEqual,
}

export default billingPeriodShed

