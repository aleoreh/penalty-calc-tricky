import daysShed, { compareDays } from "../../../lib/days"
import { KeyRatePart } from "./keyrate-part"
import { TheStateConfig } from "./types"

type Moratorium = [Date, Date]

function getKeyRate(keyRatesData: [string, number][], date: Date): number {
    return keyRatesData.filter(([startDate]) => {
        return compareDays(date, new Date(startDate)) === "GT"
    })[keyRatesData.length - 1][1]
}

export type CalculatorConfig = {
    daysToPay: number
    deferredDaysCount: number
    moratoriums: Moratorium[]
    keyRate: number
    fractionChangeDay: number
}

export function getKeyRatePart(
    config: CalculatorConfig,
    daysOverdue: number
): KeyRatePart {
    return daysOverdue < config.fractionChangeDay
        ? { numerator: 1, denominator: 300 }
        : { numerator: 1, denominator: 130 }
}

export function doesMoratoriumActs(
    config: CalculatorConfig,
    date: Date
): boolean {
    return config.moratoriums.some(([start, end]) => {
        const start_date_compare = daysShed.compare(start, date)
        const date_end_compare = daysShed.compare(date, end)
        return (
            (start_date_compare === "LT" || start_date_compare === "EQ") &&
            (date_end_compare === "EQ" || date_end_compare === "LT")
        )
    })
}

function getMoratoriums(moratoriumsData: [string, string][]): Moratorium[] {
    return moratoriumsData.map(([start, end]) => [
        new Date(start),
        new Date(end),
    ])
}

function fromTheStateConfig(
    date: Date,
    {
        daysToPay,
        deferredDaysCount,
        fractionChangeDay,
        keyRates,
        moratoriums,
    }: TheStateConfig
): CalculatorConfig {
    return {
        daysToPay,
        deferredDaysCount,
        fractionChangeDay,
        keyRate: getKeyRate(keyRates, date),
        moratoriums: getMoratoriums(moratoriums),
    }
}

export const calculatorConfigShed = {
    fromTheStateConfig,
    getKeyRatePart,
    doesMoratoriumActs,
}

export default calculatorConfigShed

