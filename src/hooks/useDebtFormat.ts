import dayjs from "dayjs"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { kopekToRuble } from "@/lib/kopek"
import {
    Debt,
    getDebtRemainingBalance,
    Payoff,
} from "../features/calculator/domain/debt"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export { type Debt, type Payoff } from "../features/calculator/domain/debt"

export function useDebtItemFormat(item: Debt) {
    return {
        period: dayjs(item.period).format("LL"),
        amount: new Intl.NumberFormat("ru", {
            style: "currency",
            currency: "RUB",
            minimumFractionDigits: 2,
        }).format(kopekToRuble(item.amount)),
        dueDate: `Просрочка с ${dayjs(item.dueDate).format("LL")}`,
        remainder: `Остаток долга: ${new Intl.NumberFormat("ru", {
            style: "currency",
            currency: "RUB",
            minimumFractionDigits: 2,
        }).format(kopekToRuble(getDebtRemainingBalance(item)))}`,
    }
}

export function usePayoffItemFormat(payoff: Payoff) {
    return {
        paymentDate: dayjs(payoff.paymentDate).format("LL"),
        repaymentAmount: `-${new Intl.NumberFormat("ru", {
            style: "currency",
            currency: "RUB",
            minimumFractionDigits: 2,
        }).format(kopekToRuble(payoff.repaymentAmount))}`,
    }
}

