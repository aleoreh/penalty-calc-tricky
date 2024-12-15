import billingPeriodShed, { BillingPeriod } from "@/lib/billing-period"
import daysShed, { compareDays } from "@/lib/days"
import kopekShed, { Kopek } from "@/lib/kopek"
import { CalculationResult, CalculationResultItem } from "./calculation-result"
import {
    CalculatorConfig,
    doesMoratoriumActs,
    fromTheStateConstants,
    getKeyRatePart,
} from "./calculator-config"
import debtShed, { Debt } from "./debt"
import { DistributionMethod } from "./distributionMethod"
import formulaShed from "./formula"
import keyRatePartShed, { KeyRatePart } from "./keyrate-part"
import paymentShed, {
    numberToPaymentId,
    Payment,
    PaymentBody,
    PaymentId,
    paymentIdToNumber,
} from "./payment"
import { KeyRate, TheStateConstants } from "./types"
import userSettingsShed, { UserSettings } from "./userSettings"

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

    const lastId = [...calculator.payments].sort(
        (x, y) => paymentShed.idToNumber(y.id) - paymentShed.idToNumber(x.id)
    )[0].id
    const res = paymentIdToNumber(lastId) + 1

    return numberToPaymentId(res)
}

/**
 * Функция распределения оплаты по периодам долгов
 */
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
            : daysShed.delta(d1.period, d2.period)
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
                    ? debtShed.withPayoff({
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
    const clearedPayoffs = calculator.debts.map(debtShed.clearPayoffs)

    const [debts, remainder] = calculator.payments.reduce(
        ([debts, remainder], payment) => {
            const { debts: newDebts, remainder: newRemainder } =
                distributePayment(
                    payment,
                    debts,
                    calculator.userSettings.distributionMethod
                )
            return [newDebts, kopekShed.add(remainder, newRemainder)] as [
                Debt[],
                Kopek
            ]
        },
        [clearedPayoffs, kopekShed.asKopek(0)] as [Debt[], Kopek]
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

/**
 * Вычисляет количество дней просрочки
 * @param dueDate - дата, до которой необходимо оплатить счёт
 * @param date - дата, на которую вычисляется результат
 */
function daysOverdue(dueDate: Date, date: Date): number {
    return daysShed.delta(dueDate, date)
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
    calculator: Calculator,
    calculationDate: Date
): Penalty {
    const config = calculator.config

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
                keyRate: getKeyRate(calculator, calculationDate),
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
            rate: getKeyRate(calculator, calculationDate),
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
            penaltyAmount: kopekShed.add(
                resultRow.penaltyAmount,
                row.penaltyAmount
            ),
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
    userSettings: UserSettings
    debts: Debt[]
    payments: Payment[]
    /** Нераспределённый остаток платежей */
    undistributedRemainder: Kopek
}

export function initCalculator(
    calculationDate: Date,
    config: CalculatorConfig,
    distributionMethod: DistributionMethod
): Calculator {
    const userSettings: UserSettings = {
        distributionMethod,
        legalEntity: config.legalEntity,
        calculationKeyRate: getKeyRateRaw(
            calculationDate,
            config.theStateConstants,
            undefined
        ),
    }
    return {
        calculationDate,
        config,
        userSettings,
        debts: [],
        payments: [],
        undistributedRemainder: kopekShed.asKopek(0),
    }
}

export function withCalculatorConfig(config: CalculatorConfig) {
    return (calculator: Calculator): Calculator =>
        distributePayments({
            ...calculator,
            config,
        })
}

export function withCalculationDate(date: Date) {
    return (calculator: Calculator): Calculator =>
        distributePayments({
            ...calculator,
            calculationDate: date,
        })
}

export function getCalculatorDebt(
    debtPeriod: BillingPeriod,
    calculator: Calculator
): Debt | undefined {
    return calculator.debts.find((x) =>
        billingPeriodShed.equal(x.period, debtPeriod)
    )
}

export function addCalculatorDebts(debts: Debt[]) {
    return (calculator: Calculator): Calculator => {
        return distributePayments({
            ...calculator,
            debts: [...calculator.debts, ...debts],
        })
    }
}

export function deleteCalculatorDebt(debtPeriod: BillingPeriod) {
    return (calculator: Calculator): Calculator => {
        return distributePayments({
            ...calculator,
            debts: calculator.debts.filter(
                (x) => !billingPeriodShed.equal(x.period, debtPeriod)
            ),
        })
    }
}

export function clearCalculatorDebts(calculator: Calculator): Calculator {
    return distributePayments({
        ...calculator,
        debts: [],
    })
}

export function withCalculatorDebts(debts: Debt[]) {
    return (calculator: Calculator): Calculator => {
        return distributePayments({
            ...calculator,
            debts,
        })
    }
}

export function updateCalculatorDebt(debt: Debt) {
    return (calculator: Calculator): Calculator => {
        return distributePayments({
            ...calculator,
            debts: calculator.debts.map((x) =>
                !billingPeriodShed.equal(x.period, debt.period) ? x : debt
            ),
        })
    }
}

export function getCalculatorPayment(
    id: PaymentId,
    calculator: Calculator
): Payment | undefined {
    return calculator.payments.find((x) => x.id === id)
}

export function addCalculatorPayment(payment: PaymentBody) {
    return (calculator: Calculator): Calculator => {
        return {
            ...calculator,
            payments: [
                ...calculator.payments,
                { ...payment, id: generateNextId(calculator) },
            ],
        }
    }
}

export function addCalculatorPayments(payments: PaymentBody[]) {
    return (calculator: Calculator): Calculator => {
        const newCalculator = payments.reduce((acc, paymentBody) => {
            return addCalculatorPayment(paymentBody)(acc)
        }, calculator)

        return distributePayments(newCalculator)
    }
}

export function deleteCalculatorPayment(paymentId: PaymentId) {
    return (calculator: Calculator): Calculator => {
        return distributePayments({
            ...calculator,
            payments: calculator.payments.filter((x) => x.id !== paymentId),
        })
    }
}

export function clearCalculatorPayments(calculator: Calculator): Calculator {
    return distributePayments({ ...calculator, payments: [] })
}

export function withCalculatorPayments(payments: Payment[]) {
    return (calculator: Calculator): Calculator => {
        return distributePayments({ ...calculator, payments })
    }
}

export function calculate(calculator: Calculator): CalculationResult[] {
    const penalties = calculator.debts.map((debt) =>
        calculatePenalty(debt, calculator, calculator.calculationDate)
    )
    return penalties.map(penaltyToResult)
}

export function withCalculatorUserSettings(userSettings: UserSettings) {
    return (calculator: Calculator): Calculator => {
        return distributePayments({
            ...calculator,
            config: fromTheStateConstants(
                userSettings.legalEntity,
                calculator.config.theStateConstants
            ),
            userSettings: { ...calculator.userSettings, ...userSettings },
        })
    }
}

export function calculatorTotalDebtAmount(calculator: Calculator): Kopek {
    return calculator.debts.reduce((acc, x) => {
        return kopekShed.add(acc, x.amount)
    }, kopekShed.asKopek(0))
}

export function withCalculationKeyRate(keyRate: KeyRate) {
    return (calculator: Calculator): Calculator => {
        const newUserSettings = userSettingsShed.withCalculationKeyRate(
            keyRate
        )(calculator.userSettings)
        return distributePayments({
            ...calculator,
            userSettings: newUserSettings,
        })
    }
}

function getKeyRateRaw(
    date: Date,
    theStateConstants: TheStateConstants,
    userKeyRate: KeyRate | undefined
) {
    if (userKeyRate !== undefined) return userKeyRate

    const keyRatesData = theStateConstants.keyRates
    return keyRatesData.filter(([startDate]) => {
        const res = compareDays(date, new Date(startDate))
        return res === "EQ" || res === "GT"
    })[keyRatesData.length - 1][1]
}

export function getKeyRate(calculator: Calculator, date: Date): number {
    return getKeyRateRaw(
        date,
        calculator.config.theStateConstants,
        calculator.userSettings.calculationKeyRate
    )
}

export const calculatorShed = {
    init: initCalculator,
    withConfig: withCalculatorConfig,
    withCalculationDate,
    withKeyRate: withCalculationKeyRate,
    getDebt: getCalculatorDebt,
    addDebts: addCalculatorDebts,
    deleteDebt: deleteCalculatorDebt,
    clearDebts: clearCalculatorDebts,
    withDebts: withCalculatorDebts,
    updateDebt: updateCalculatorDebt,
    getPayment: getCalculatorPayment,
    addPayment: addCalculatorPayment,
    addPayments: addCalculatorPayments,
    deletePayment: deleteCalculatorPayment,
    clearPayments: clearCalculatorPayments,
    withPayments: withCalculatorPayments,
    withUserSettings: withCalculatorUserSettings,
    totalDebtAmount: calculatorTotalDebtAmount,
    getKeyRate,
    calculate,
}

export default calculatorShed

