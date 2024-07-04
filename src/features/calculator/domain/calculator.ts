import billingPeriodShed from "@/lib/billing-period"
import daysShed from "@/lib/days"
import kopekShed, { Kopek } from "@/lib/kopek"
import { CalculationResult, CalculationResultItem } from "./calculation-result"
import {
    CalculatorConfig,
    doesMoratoriumActs,
    getKeyRatePart,
} from "./calculator-config"
import debtShed, { Debt } from "./debt"
import formulaShed from "./formula"
import keyRatePartShed, { KeyRatePart } from "./keyrate-part"
import paymentShed, { Payment, PaymentBody, PaymentId } from "./payment"

export type DistributionMethod = "fifo" | "byPaymentPeriod"

type PenaltyItem = {
    id: number
    date: Date
    debtAmount: Kopek
    ratePart: KeyRatePart
    rate: number
    doesMoratoriumActs: boolean
    doesDefermentActs: boolean
    penaltyAmount: Kopek
}

type Penalty = {
    period: Date
    rows: PenaltyItem[]
}

function generateNextId(calculator: Calculator): PaymentId {
    if (calculator.payments.length === 0) return paymentShed.numberToId(1)

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
     * byPaymentPeriod - сначала целевой период (payment.period), затем - fifo
     */
    const sorter = (d1: Debt, d2: Debt) => {
        // для метода byPaymentPeriod:
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

function doesDefermentActs(
    dueDate: Date,
    deferredDaysCount: number,
    date: Date
): boolean {
    return (
        daysShed.compare(date, daysShed.add(dueDate, deferredDaysCount)) ===
        "LT"
    )
}

function daysOverdue(dueDate: Date, date: Date): number {
    return daysShed.diff(dueDate, date)
}

function calculateDailyAmount(
    params: {
        dueDate: Date
        deferredDaysCount: number
        keyRatePart: KeyRatePart
        keyRate: number
        doesMoratoriumActs: boolean
    },
    debtAmount: Kopek,
    date: Date
): Kopek {
    const k = keyRatePartShed.getNumericValue(params.keyRatePart)
    const r = params.keyRate
    const s = debtAmount

    return (
        doesDefermentActs(params.dueDate, params.deferredDaysCount, date) ||
        params.doesMoratoriumActs
            ? 0
            : k * r * s
    ) as Kopek
}

function calculatePenalty(
    debt: Debt,
    config: CalculatorConfig,
    calculationDate: Date
): Penalty {
    // -------- helpers ------- //

    const makeRow = (debtAmount: Kopek, date: Date): PenaltyItem => {
        const overdueCount = daysOverdue(debt.dueDate, date)
        const hasDeferment = doesDefermentActs(
            debt.dueDate,
            config.deferredDaysCount,
            date
        )
        const hasMoratorium = doesMoratoriumActs(config, date)
        const ratePart = getKeyRatePart(config, overdueCount)
        const penaltyAmount = calculateDailyAmount(
            {
                deferredDaysCount: config.deferredDaysCount,
                doesMoratoriumActs: doesMoratoriumActs(config, date),
                dueDate: debt.dueDate,
                keyRate: config.keyRate,
                keyRatePart: ratePart,
            },
            debtAmount,
            date
        )

        return {
            id: date.valueOf(),
            date,
            debtAmount,
            doesDefermentActs: hasDeferment,
            doesMoratoriumActs: hasMoratorium,
            penaltyAmount,
            rate: config.keyRate,
            ratePart,
        }
    }
    const nextRow = (row: PenaltyItem): PenaltyItem => {
        const dayPayment = debt.payoffs
            .filter((payoff) => daysShed.equals(payoff.paymentDate, row.date))
            .reduce((acc, value) => acc + value.repaymentAmount, 0)

        const newDebtAmount = row.debtAmount - dayPayment
        const newDay = daysShed.add(row.date, 1)

        return makeRow(kopekShed.asKopek(newDebtAmount), newDay)
    }

    // --------- main --------- //

    const rows: PenaltyItem[] = []

    let curRow: PenaltyItem = makeRow(debt.amount, debt.dueDate)

    while (daysShed.compare(curRow.date, calculationDate) === "LT") {
        rows.push(curRow)
        curRow = nextRow(curRow)
    }

    return {
        period: debt.period,
        rows,
    }
}

function penaltyToResult(penalty: Penalty): CalculationResult {
    const addResultRow = (row: PenaltyItem): CalculationResultItem => {
        return {
            ...row,
            dateFrom: row.date,
            dateTo: row.date,
            totalDays: 1,
            ratePart: row.ratePart,
            formula: formulaShed.empty,
        }
    }

    const joinResultRow = (
        resultRow: CalculationResultItem,
        row: PenaltyItem
    ): CalculationResultItem => {
        const res = {
            ...resultRow,
            dateTo: row.date,
            totalDays: resultRow.totalDays + 1,
            penaltyAmount: (resultRow.penaltyAmount +
                row.penaltyAmount) as Kopek,
            formula: "",
        }
        return { ...res, formula: formulaShed.create(res) }
    }

    const equals = (
        resultRow: Pick<
            CalculationResultItem,
            | "debtAmount"
            | "rate"
            | "ratePart"
            | "doesMoratoriumActs"
            | "doesDefermentActs"
        >,
        penaltyRow: Pick<
            PenaltyItem,
            | "debtAmount"
            | "rate"
            | "ratePart"
            | "doesDefermentActs"
            | "doesMoratoriumActs"
        >
    ) => {
        return (
            resultRow.debtAmount === penaltyRow.debtAmount &&
            resultRow.rate === penaltyRow.rate &&
            keyRatePartShed.equals(resultRow.ratePart, penaltyRow.ratePart) &&
            resultRow.doesMoratoriumActs === penaltyRow.doesMoratoriumActs &&
            resultRow.doesDefermentActs === penaltyRow.doesDefermentActs
        )
    }

    return {
        period: penalty.period,
        rows: penalty.rows.reduce(
            (acc, row) =>
                acc.length === 0 || !equals(acc[acc.length - 1], row)
                    ? [...acc, addResultRow(row)]
                    : [
                          ...acc.slice(0, -1),
                          joinResultRow(acc[acc.length - 1], row),
                      ],
            [] as CalculationResult["rows"]
        ),
    }
}

export type Calculator = {
    calculationDate: Date
    config: CalculatorConfig
    debts: Debt[]
    payments: Payment[]
    distributionMethod: DistributionMethod
    /** Нераспределённый остаток платежей */
    undistributedRemainder: Kopek
}

export function initCalculator(
    calculationDate: Date,
    config: CalculatorConfig,
    distributionMethod: DistributionMethod
): Calculator {
    return {
        calculationDate,
        config,
        debts: [],
        payments: [],
        distributionMethod,
        undistributedRemainder: kopekShed.asKopek(0),
    }
}

export function setCalculatorConfig(config: CalculatorConfig) {
    return (calculator: Calculator): Calculator =>
        distributePayments({
            ...calculator,
            config,
        })
}

export function setCalculationDate(date: Date) {
    return (calculator: Calculator): Calculator =>
        distributePayments({
            ...calculator,
            calculationDate: date,
        })
}

export function setDistributionMethod(distributionMethod: DistributionMethod) {
    return (calculator: Calculator): Calculator =>
        distributePayments({
            ...calculator,
            distributionMethod: distributionMethod,
        })
}

export function addCalculatorDebts(debts: Debt[]) {
    return (calculator: Calculator): Calculator => {
        return distributePayments({
            ...calculator,
            debts: [...calculator.debts, ...debts],
        })
    }
}

export function clearCalculatorDebts(calculator: Calculator): Calculator {
    return distributePayments({
        ...calculator,
        debts: [],
    })
}

export function setCalculatorDebts(debts: Debt[]) {
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
            payments: newPayments,
        })
    }
}

export function clearCalculatorPayments(calculator: Calculator): Calculator {
    return distributePayments({ ...calculator, payments: [] })
}

export function setCalculatorPayments(payments: Payment[]) {
    return (calculator: Calculator): Calculator => {
        return distributePayments({ ...calculator, payments })
    }
}

export function calculate(calculator: Calculator): CalculationResult[] {
    const penalties = calculator.debts.map((debt) =>
        calculatePenalty(debt, calculator.config, calculator.calculationDate)
    )
    return penalties.map(penaltyToResult)
}

export const calculatorShed = {
    init: initCalculator,
    setConfig: setCalculatorConfig,
    setCalculationDate,
    setDistributionMethod,
    addDebts: addCalculatorDebts,
    clearDebts: clearCalculatorDebts,
    setDebts: setCalculatorDebts,
    addPayments: addCalculatorPayments,
    clearPayments: clearCalculatorPayments,
    setPayments: setCalculatorPayments,
    calculate,
}

export default calculatorShed

