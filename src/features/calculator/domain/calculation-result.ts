import kopekShed, { Kopek } from "@/lib/kopek"
import { Formula } from "./formula"
import { KeyRatePart } from "./keyrate-part"

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

export function calculationResultItemsTotal(
    calculationResultItems: CalculationResultItem[]
): Kopek {
    return calculationResultItems.reduce((acc, row) => {
        return kopekShed.add(acc, row.penaltyAmount)
    }, kopekShed.asKopek(0))
}

export const calculationResultShed = {
    itemsTotal: calculationResultItemsTotal,
}

export default calculationResultShed
