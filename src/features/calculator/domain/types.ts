import { Kopek } from "../../../lib/kopek"
import { Formula } from "./formula"

export type KeyRate = number

export type KeyRatePart = {
    numerator: number
    denominator: number
}

export type TheStateConfig = {
    daysToPay: number
    deferredDaysCount: number
    fractionChangeDay: number
    keyRates: [DateString, KeyRate][]
    moratoriums: [DateString, DateString][]
}

export type Moratorium = [Date, Date]

export type PenaltyItem = {
    id: number
    date: Date
    debtAmount: Kopek
    ratePart: KeyRatePart
    rate: number
    doesMoratoriumActs: boolean
    doesDefermentActs: boolean
    penaltyAmount: Kopek
}

export type Penalty = {
    period: Date
    rows: PenaltyItem[]
}

export type CalculationResultItem = {
    debtAmount: Kopek
    dateFrom: Date
    dateTo: Date
    totalDays: number
    ratePart: KeyRatePart
    rate: number
    doesMoratoriumActs: boolean
    doesDefermentActs: boolean
    formula: Formula
    penaltyAmount: Kopek
}

export type CalculationResult = {
    period: Date
    rows: CalculationResultItem[]
}

