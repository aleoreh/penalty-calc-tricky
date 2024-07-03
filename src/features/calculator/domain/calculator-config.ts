import daysShed, { compareDays } from "@/lib/days"
import { KeyRatePart } from "./keyrate-part"
import { TheStateConfig } from "./types"

export type Moratorium = [Date, Date]

function getKeyRate(keyRatesData: [string, number][], date: Date): number {
    return keyRatesData.filter(([startDate]) => {
        return compareDays(date, new Date(startDate)) === "GT"
    })[keyRatesData.length - 1][1]
}

export type LegalEntity = "natural" | "artificial"

export type CalculatorConfigTemplate = {
    theStateConstants: TheStateConfig
    keyRate: number
}

export type CalculatorConfig = {
    legalEntity: LegalEntity
    theStateConstants: TheStateConfig
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
    legalEntity: LegalEntity,
    theStateConstants: TheStateConfig
): CalculatorConfig {
    const naturalConfig: CalculatorConfig = {
        ...theStateConstants,
        legalEntity,
        theStateConstants,
        keyRate: getKeyRate(theStateConstants.keyRates, date),
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
    fromTheStateConfig,
    getKeyRatePart,
    doesMoratoriumActs,
}

export default calculatorConfigShed

