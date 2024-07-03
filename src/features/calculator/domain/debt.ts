import { BillingPeriod } from "@/lib/billing-period"
import kopekShed, { Kopek } from "@/lib/kopek"
import { PaymentId } from "./payment"

type Payoff = {
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

export const debtShed = {
    addPayoff: addDebtPayoff,
    updatePayoff: updateDebtPayoff,
    getRemainingBalance: getDebtRemainingBalance,
}

export default debtShed

