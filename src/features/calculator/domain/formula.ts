import { Kopek, kopekToRuble } from "@/lib/kopek"
import { KeyRatePart } from "./keyrate-part"

export type Formula = string

type CreateFormulaParams = {
    debtAmount: Kopek
    rate: number
    doesDefermentActs: boolean
    doesMoratoriumActs: boolean
    totalDays: number
    ratePart: KeyRatePart
}

function formatKeyRatePart(value: KeyRatePart): string {
    return `${value.numerator}/${value.denominator}`
}

export const emptyFormula: Formula = ""

export function createFormula({
    debtAmount,
    rate,
    doesDefermentActs,
    doesMoratoriumActs,
    totalDays,
    ratePart,
}: CreateFormulaParams) {
    const debtAmountFormatted = new Intl.NumberFormat("ru-RU", {
        style: "decimal",
        minimumFractionDigits: 2,
    }).format(kopekToRuble(debtAmount))
    const keyRateFormatted = `${rate * 100}%`
    return doesDefermentActs
        ? "Отсрочка"
        : doesMoratoriumActs
        ? "Мораторий"
        : `${totalDays} ∙ ${formatKeyRatePart(
              ratePart
          )} ∙ ${keyRateFormatted} ∙ ${debtAmountFormatted}`
}

const formulaShed = {
    empty: emptyFormula,
    create: createFormula,
}

export default formulaShed

