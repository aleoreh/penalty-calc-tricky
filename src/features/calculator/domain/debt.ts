import billingPeriodShed, { BillingPeriod } from "@/lib/billing-period"
import daysShed from "@/lib/days"
import kopekShed, { Kopek } from "@/lib/kopek"
import { pipe } from "@mobily/ts-belt"
import { PaymentId } from "./payment"

/**
 * Часть платежа, которая погашает определённый долг
 */
export type Payoff = {
    paymentId: PaymentId
    paymentDate: Date
    repaymentAmount: Kopek
}

/**
 * Долг за определённый расчётный период
 */
export type Debt = {
    period: BillingPeriod
    amount: Kopek
    dueDate: Date
    payoffs: Payoff[]
}

export function initDebt(
    period: BillingPeriod,
    dueDate: Date,
    amount: Kopek
): Debt {
    return {
        period,
        amount,
        dueDate,
        payoffs: [],
    }
}

export function getDebtRemainingBalance(debt: Debt): Kopek {
    return kopekShed.subtract(
        debt.amount,
        debt.payoffs.reduce(
            (acc, payoff) => kopekShed.add(acc, payoff.repaymentAmount),
            kopekShed.asKopek(0)
        )
    )
}

export function addDebtPayoff({
    paymentId,
    paymentDate,
    repaymentAmount,
}: Payoff) {
    return (debt: Debt): Debt => ({
        ...debt,
        payoffs: [
            ...debt.payoffs,
            {
                paymentId,
                paymentDate,
                repaymentAmount,
            },
        ],
    })
}

export function withDebtPayoff(payoff: Payoff) {
    return (debt: Debt): Debt => ({
        ...debt,
        payoffs: debt.payoffs.map((x) =>
            x.paymentId === payoff.paymentId ? { ...x, ...payoff } : x
        ),
    })
}

export function getDefaultDueDate(
    debtPeriod: BillingPeriod,
    daysToPay: number
): Date {
    return pipe(
        daysShed.endOfPeriod(billingPeriodShed.toDate(debtPeriod), "month"),
        (x) => daysShed.add(x, daysToPay + 1)
    )
}

export function updateDebt(params: { dueDate?: Date; amount?: Kopek }) {
    return (debt: Debt): Debt => {
        return {
            ...debt,
            dueDate: params.dueDate ?? debt.dueDate,
            amount: params.amount ?? debt.amount,
        }
    }
}

export function clearDebtPayoffs(debt: Debt) {
    return { ...debt, payoffs: [] }
}

export const debtShed = {
    initDebt,
    addPayoff: addDebtPayoff,
    withPayoff: withDebtPayoff,
    getRemainingBalance: getDebtRemainingBalance,
    getDefaultDueDate,
    updateDebt,
    clearPayoffs: clearDebtPayoffs,
}

export default debtShed

