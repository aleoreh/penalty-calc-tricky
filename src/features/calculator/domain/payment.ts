import { BillingPeriod } from "@/lib/billing-period"
import { Kopek } from "@/lib/kopek"
import Opaque, { create, widen } from "ts-opaque"

export type PaymentId = Opaque<number, Payment>

export type PaymentBody = {
    date: Date
    amount: Kopek
    period?: BillingPeriod
}

/**
 * Оплата
 */
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

export function updatePayment(params: {
    date?: Date
    amount?: Kopek
    period?: BillingPeriod
}) {
    return (payment: Payment): Payment => {
        return {
            ...payment,
            date: params.date ?? payment.date,
            amount: params.amount ?? payment.amount,
            period: params.period ?? payment.period,
        }
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
    update: updatePayment,
    idToNumber: paymentIdToNumber,
    numberToId: numberToPaymentId,
}

export default paymentShed

