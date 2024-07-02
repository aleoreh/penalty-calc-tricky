import billingPeriodShed from "../../../lib/billing-period"
import daysShed from "../../../lib/days"
import kopekShed, { Kopek } from "../../../lib/kopek"
import { CalculatorConfig } from "./calculator-config"
import debtShed, { Debt } from "./debt"
import paymentShed, { Payment, PaymentBody, PaymentId } from "./payment"

type DistributionMethod = "fifo" | "byPaymentPeriod"

export type Calculator = {
    calculationDate: Date
    config: CalculatorConfig
    debts: Debt[]
    payments: Payment[]
    distributionMethod: DistributionMethod
    /** Нераспределённый остаток платежей */
    undistributedRemainder: Kopek
}

function generateNextId(calculator: Calculator): PaymentId {
    return [...calculator.payments].sort(
        (x, y) => paymentShed.idToNumber(y.id) - paymentShed.idToNumber(x.id)
    )[0].id
}

function distributePayment(
    payment: Payment,
    debts: Debt[],
    method: DistributionMethod
): { debts: Debt[]; remainder: Kopek } {
    const replaceDebt = (debt: Debt, debts: Debt[]) => {
        return debts.map((x) =>
            billingPeriodShed.equal(x.period, debt.period) ? debt : x
        )
    }

    if (debts.length === 0) return { debts, remainder: payment.amount }

    /**
     * fifo - сортируем по возрастанию периода долга
     * lastIsFirst - сначала целевой период (payment.period), затем - fifo
     */
    const sorter = (d1: Debt, d2: Debt) => {
        // для метода lastIsFirst:
        // payment.period всегда меньше остальных,
        // любой другой всегда больше payment.period
        return method === "fifo" || !payment.period
            ? d1.period.getTime() - d2.period.getTime()
            : billingPeriodShed.equal(d1.period, payment.period)
            ? -1
            : billingPeriodShed.equal(d2.period, payment.period)
            ? 1
            : daysShed.diff(d1.period, d2.period)
    }

    const sortedDebts = [...debts].sort(sorter)

    return sortedDebts.reduce(
        ({ debts, remainder }, debt) => {
            if (remainder === 0) return { debts, remainder }

            const debtRemainingBalance = debtShed.getRemainingBalance(debt)
            const [repaymentAmount, nextRemainder] =
                remainder < debtRemainingBalance
                    ? [remainder, kopekShed.asKopek(0)]
                    : [
                          debtRemainingBalance,
                          kopekShed.subtract(remainder, debtRemainingBalance),
                      ]

            const foundPayoff = debt.payoffs.find(
                (x) => x.paymentId === payment.id
            )

            const updatedDebt =
                foundPayoff !== undefined
                    ? debtShed.updatePayoff({
                          ...foundPayoff,
                          repaymentAmount,
                      })(debt)
                    : debtShed.addPayoff({
                          paymentId: payment.id,
                          paymentDate: payment.date,
                          repaymentAmount,
                      })(debt)

            const nextDebts = replaceDebt(updatedDebt, debts)

            return { debts: nextDebts, remainder: nextRemainder }
        },
        {
            debts,
            remainder: payment.amount,
        }
    )
}

function distributePayments(calculator: Calculator): Calculator {
    const [debts, remainder] = calculator.payments.reduce(
        ([debts, remainder], payment) => {
            const { debts: newDebts, remainder: newRemainder } =
                distributePayment(payment, debts, calculator.distributionMethod)
            return [newDebts, kopekShed.add(remainder, newRemainder)] as [
                Debt[],
                Kopek
            ]
        },
        [calculator.debts, kopekShed.asKopek(0)] as [Debt[], Kopek]
    )
    return {
        ...calculator,
        debts,
        undistributedRemainder: remainder,
    }
}

function setCalculatorConfig(config: CalculatorConfig) {
    return (calculator: Calculator): Calculator =>
        distributePayments({
            ...calculator,
            config,
        })
}

function setCalculationDate(date: Date) {
    return (calculator: Calculator): Calculator =>
        distributePayments({
            ...calculator,
            calculationDate: date,
        })
}

function setDistributionMethod(distributionMethod: DistributionMethod) {
    return (calculator: Calculator): Calculator =>
        distributePayments({
            ...calculator,
            distributionMethod: distributionMethod,
        })
}

function addCalculatorDebts(debts: Debt[]) {
    return (calculator: Calculator): Calculator => {
        return distributePayments({
            ...calculator,
            debts: [...calculator.debts, ...debts],
        })
    }
}

function clearCalculatorDebts(calculator: Calculator): Calculator {
    return distributePayments({
        ...calculator,
        debts: [],
    })
}

function setCalculatorDebts(debts: Debt[]) {
    return (calculator: Calculator): Calculator => {
        return distributePayments({
            ...calculator,
            debts,
        })
    }
}

export function addCalculatorPayments(payments: PaymentBody[]) {
    return (calculator: Calculator): Calculator => {
        const newPayments = payments.reduce((acc, paymentBody) => {
            const newPayment: Payment = {
                ...paymentBody,
                id: generateNextId(calculator),
            }
            return [...acc, newPayment]
        }, calculator.payments)
        return distributePayments({
            ...calculator,
            ...newPayments,
        })
    }
}

export function clearCalculatorPayments(calculator: Calculator): Calculator {
    return distributePayments({ ...calculator, payments: [] })
}

export const calculatorShed = {
    setConfig: setCalculatorConfig,
    setCalculationDate,
    setDistributionMethod,
    addDebts: addCalculatorDebts,
    clearDebts: clearCalculatorDebts,
    setDebts: setCalculatorDebts,
    addPayments: addCalculatorPayments,
    clearPayments: clearCalculatorPayments,
}

export default calculatorShed

