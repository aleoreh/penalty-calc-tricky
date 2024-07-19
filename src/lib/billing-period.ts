import Opaque, { create, widen } from "ts-opaque"
import daysShed, { beginOfPeriod } from "./days"

/**
 * Расчётный период (месяц)
 */
export type BillingPeriod = Opaque<Date, "BillingPeriod">

export function billingPeriodFromDate(
    anyDateWithinPeriod: Date
): BillingPeriod {
    return create(beginOfPeriod(anyDateWithinPeriod, "month"))
}

export function billingPeriodToDate(billingPeriod: BillingPeriod): Date {
    return widen(billingPeriod)
}

export function billingPeriodsEqual(
    period1: BillingPeriod,
    period2: BillingPeriod
): boolean {
    return (
        daysShed.beginOfPeriod(widen(period1), "month").getTime() ===
        daysShed.beginOfPeriod(widen(period2), "month").getTime()
    )
}

export const billingPeriodShed = {
    fromDate: billingPeriodFromDate,
    toDate: billingPeriodToDate,
    equal: billingPeriodsEqual,
}

export default billingPeriodShed

