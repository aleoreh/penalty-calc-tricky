import Opaque from "ts-opaque"
import { BillingPeriod } from "../../../lib/billing-period"
import { Kopek } from "../../../lib/kopek"

export type PaymentId = Opaque<number, Payment>

export type PaymentBody = {
    date: Date
    amount: Kopek
    period?: BillingPeriod
}

export type Payment = {
    id: PaymentId
} & PaymentBody

export function paymentIdToNumber(paymentId: PaymentId): number {
    return paymentId as number
}

export const paymentShed = {
    idToNumber: paymentIdToNumber,
}

export default paymentShed
