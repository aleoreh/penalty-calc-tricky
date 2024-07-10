import { BillingPeriod } from "@/lib/billing-period"
import { Kopek } from "@/lib/kopek"
import Opaque, { create, widen } from "ts-opaque"

export type PaymentId = Opaque<number, Payment>

export type PaymentBody = {
    date: Date
    amount: Kopek
    period?: BillingPeriod
}

export type Payment = {
    id: PaymentId
} & PaymentBody

export function initPayment(
    date: Date,
    amount: Kopek,
    period?: BillingPeriod
): PaymentBody {
    return {
        date,
        amount,
        period,
    }
}

export function paymentIdToNumber(paymentId: PaymentId): number {
    return widen(paymentId)
}

export function numberToPaymentId(value: number): PaymentId {
    return create(value)
}

export const paymentShed = {
    init: initPayment,
    idToNumber: paymentIdToNumber,
    numberToId: numberToPaymentId,
}

export default paymentShed

