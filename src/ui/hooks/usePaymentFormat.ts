import dayjs from "dayjs"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { Payment } from "@/features/calculator/domain/payment"
import { kopekToRuble } from "@/lib/kopek"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export { type Payment } from "@/features/calculator/domain/payment"

export function usePaymentFormat(payment: Payment) {
    return {
        date: dayjs(payment.date).format("L"),
        amount: Intl.NumberFormat("ru", {
            style: "currency",
            currency: "RUB",
            minimumFractionDigits: 2,
        }).format(kopekToRuble(payment.amount)),
        period:
            payment.period !== undefined
                ? dayjs(payment.period).format("MMMM YYYY")
                : "",
    }
}
