import Opaque from "ts-opaque"
import { BillingPeriod } from "../../../lib/billing-period"
import { Kopek } from "../../../lib/kopek"

export type KeyRate = number

export type TheStateConfig = {
    daysToPay: number
    deferredDaysCount: number
    fractionChangeDay: number
    keyRates: [DateString, KeyRate][]
    moratoriums: [DateString, DateString][]
}

export type Moratorium = [Date, Date]

export type Payoff = {
    paymentId: PaymentId
    paymentDate: Date
    repaymentAmount: Kopek
}

export type Debt = {
    period: BillingPeriod
    amount: Kopek
    dueDate: Date
    payoffs: Payoff[]
}

export type PaymentId = Opaque<string, Payment>

export type PaymentBody = {
    date: Date
    amount: Kopek
    period?: Date
}

export type Payment = {
    id: PaymentId
} & PaymentBody

export type CalculatorConfig = {
    daysToPay: number
    deferredDaysCount: number
    moratoriums: Moratorium[]
    keyRate: number
    fractionChangeDay: number
}

export type Calculator = {
    calculationDate: Date
    config: CalculatorConfig
    debts: Debt[]
    payments: Payment[]
}

