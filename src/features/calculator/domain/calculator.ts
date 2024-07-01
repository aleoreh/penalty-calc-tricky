import { Debt, Moratorium, Payment } from "./types"

type CalculatorConfig = {
    daysToPay: number
    deferredDaysCount: number
    moratoriums: Moratorium[]
    keyRate: number
    fractionChangeDay: number
}

type DistributionMethod = "fifo" | "byPaymentPeriod"

export type Calculator = {
    calculationDate: Date
    config: CalculatorConfig
    debts: Debt[]
    payments: Payment[]
    distributionMethod: DistributionMethod
}
