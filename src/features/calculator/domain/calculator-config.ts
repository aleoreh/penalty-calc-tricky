import { compareDays } from "../../../lib/days"
import { Moratorium, TheStateConfig } from "./types"

export type CalculatorConfig = {
    daysToPay: number
    deferredDaysCount: number
    moratoriums: Moratorium[]
    keyRate: number
    fractionChangeDay: number
}

function getKeyRate(keyRatesData: [string, number][], date: Date): number {
    return keyRatesData.filter(([startDate]) => {
        return compareDays(date, new Date(startDate)) === "GT"
    })[keyRatesData.length - 1][1]
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
}

export default calculatorConfigShed

