import billingPeriodShed, { BillingPeriod } from "@/lib/billing-period"
import kopekShed, { Kopek } from "@/lib/kopek"
import { PaymentId } from "./payment"
import daysShed from "../../../lib/days"
import { pipe } from "@mobily/ts-belt"

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

export function updateDebtPayoff(payoff: Payoff) {
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

export const debtShed = {
    initDebt,
    addPayoff: addDebtPayoff,
    updatePayoff: updateDebtPayoff,
    getRemainingBalance: getDebtRemainingBalance,
    getDefaultDueDate,
}

export default debtShed

