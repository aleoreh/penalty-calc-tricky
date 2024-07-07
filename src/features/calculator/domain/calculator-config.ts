import daysShed, { compareDays } from "@/lib/days"
import { KeyRatePart } from "./keyrate-part"
import { TheStateConstants } from "./types"

export type Moratorium = [Date, Date]

export function getKeyRate(
    calculatorConfig: CalculatorConfig,
    date: Date
): number {
    const keyRatesData = calculatorConfig.theStateConstants.keyRates
    return keyRatesData.filter(([startDate]) => {
        const res = compareDays(date, new Date(startDate))
        return res === "EQ" || res === "GT"
    })[keyRatesData.length - 1][1]
}

export type LegalEntity = "natural" | "artificial"

export type CalculatorConfig = {
    legalEntity: LegalEntity
    theStateConstants: TheStateConstants
    daysToPay: number
    deferredDaysCount: number
    moratoriums: Moratorium[]
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

export function fromTheStateConstants(
    legalEntity: LegalEntity,
    theStateConstants: TheStateConstants
): CalculatorConfig {
    const naturalConfig: CalculatorConfig = {
        ...theStateConstants,
        legalEntity,
        theStateConstants,
        moratoriums: getMoratoriums(theStateConstants.moratoriums),
    }

    switch (legalEntity) {
        case "natural":
            return naturalConfig
        case "artificial":
            return {
                ...naturalConfig,
                deferredDaysCount: 0,
                fractionChangeDay: -Infinity,
            }
    }
}

export const calculatorConfigShed = {
    fromTheStateConstants,
    getKeyRatePart,
    getKeyRate,
    doesMoratoriumActs,
}

export default calculatorConfigShed

