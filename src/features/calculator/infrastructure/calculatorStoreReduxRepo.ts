import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit"
import {
    array,
    datelike,
    Decoder,
    number,
    object,
    oneOf,
    optional,
    string,
    tuple,
} from "decoders"
import {
    BillingPeriod,
    billingPeriodFromDate,
} from "../../../lib/billing-period"
import { Kopek, kopekAsNumber, numberAsKopek } from "../../../lib/kopek"
import { CalculatorStoreRepo } from "../domain"
import { Calculator, DistributionMethod } from "../domain/calculator"
import {
    CalculatorConfig,
    LegalEntity,
    Moratorium,
} from "../domain/calculator-config"
import { Debt, Payoff } from "../domain/debt"
import {
    numberToPaymentId,
    Payment,
    PaymentId,
    paymentIdToNumber,
} from "../domain/payment"
import { KeyRate, TheStateConstants } from "../domain/types"
import { UserSettings } from "../domain/userSettings"

const dateEncoder = datelike

const dateEncode = (value: Date) => value.toISOString()

const keyRateDecoder: Decoder<KeyRate> = number.transform((x) => x as KeyRate)

const keyRatesDecoder: Decoder<[Date, KeyRate][]> = array(
    tuple(dateEncoder, keyRateDecoder)
)

const keyRatesEncode = (keyRates: [Date, KeyRate][]) =>
    keyRates.map(
        ([date, keyRate]) =>
            [dateEncode(date), keyRate] as [DateString, KeyRate]
    )

const theStateConstantsDecoder: Decoder<TheStateConstants> = object({
    daysToPay: number,
    deferredDaysCount: number,
    fractionChangeDay: number,
    keyRates: keyRatesDecoder,
    moratoriums: array(tuple(string, string)),
})

const theStateConstantsEncode = (value: TheStateConstants) => ({
    ...value,
    keyRates: keyRatesEncode(value.keyRates),
})

const legalEntityDecoder: Decoder<LegalEntity> = oneOf([
    "natural",
    "artificial",
])

const legalEntityEncode = (value: LegalEntity) => value as string

const moratoriumDecoder: Decoder<Moratorium> = tuple(dateEncoder, dateEncoder)

const moratoriumEncode = ([from, to]: Moratorium) =>
    [dateEncode(from), dateEncode(to)] as [string, string]

const calculatorConfigDecoder: Decoder<CalculatorConfig> = object({
    legalEntity: legalEntityDecoder,
    theStateConstants: theStateConstantsDecoder,
    daysToPay: number,
    deferredDaysCount: number,
    moratoriums: array(moratoriumDecoder),
    fractionChangeDay: number,
    calculationKeyRate: optional(keyRateDecoder),
})

const calculatorConfigEncode = (value: CalculatorConfig) => ({
    ...value,
    legalEntity: legalEntityEncode(value.legalEntity),
    theStateConstants: theStateConstantsEncode(value.theStateConstants),
    moratoriums: value.moratoriums.map(moratoriumEncode),
    calculationKeyRate: value.calculationKeyRate,
})

const distributionMethodDecoder: Decoder<DistributionMethod> = oneOf([
    "fifo",
    "byPaymentPeriod",
])

const userSettingsDecoder: Decoder<UserSettings> = object({
    distributionMethod: distributionMethodDecoder,
    legalEntity: legalEntityDecoder,
})

const userSettingsEncode = (value: UserSettings) => value

const paymentIdDecoder: Decoder<PaymentId> = number.transform(numberToPaymentId)

const paymentIdEncode = paymentIdToNumber

const kopekDecoder: Decoder<Kopek> = number.transform(numberAsKopek)

const kopekEncode = kopekAsNumber

const payoffDecoder: Decoder<Payoff> = object({
    paymentId: paymentIdDecoder,
    paymentDate: dateEncoder,
    repaymentAmount: kopekDecoder,
})

const payoffEncode = (value: Payoff) => ({
    ...value,
    paymentId: paymentIdEncode(value.paymentId),
    paymentDate: dateEncode(value.paymentDate),
    repaymentAmount: kopekAsNumber(value.repaymentAmount),
})

const billingPeriodDecoder: Decoder<BillingPeriod> = dateEncoder.transform(
    billingPeriodFromDate
)

const billingPeriodEncode = (value: BillingPeriod | undefined) =>
    value ? dateEncode(billingPeriodFromDate(value)) : undefined

const debtDecoder: Decoder<Debt> = object({
    period: billingPeriodDecoder,
    amount: kopekDecoder,
    dueDate: dateEncoder,
    payoffs: array(payoffDecoder),
})

const debtEncode = (value: Debt) => ({
    ...value,
    period: billingPeriodEncode(value.period),
    amount: kopekEncode(value.amount),
    dueDate: dateEncode(value.dueDate),
    payoffs: value.payoffs.map(payoffEncode),
})

const paymentDecoder: Decoder<Payment> = object({
    id: paymentIdDecoder,
    date: dateEncoder,
    amount: kopekDecoder,
    period: optional(billingPeriodDecoder),
})

const paymentEncode = (value: Payment) => ({
    ...value,
    id: paymentIdEncode(value.id),
    date: dateEncode(value.date),
    amount: kopekEncode(value.amount),
    period: billingPeriodEncode(value.period),
})

const calculatorDecoder: Decoder<Calculator> = object({
    calculationDate: dateEncoder,
    config: calculatorConfigDecoder,
    userSettings: userSettingsDecoder,
    debts: array(debtDecoder),
    payments: array(paymentDecoder),
    undistributedRemainder: kopekDecoder,
})

const calculatorEncode = (value: Calculator) => ({
    ...value,
    calculationDate: dateEncode(value.calculationDate),
    config: calculatorConfigEncode(value.config),
    userSettings: userSettingsEncode(value.userSettings),
    debts: value.debts.map(debtEncode),
    payments: value.payments.map(paymentEncode),
    undistributedRemainder: kopekEncode(value.undistributedRemainder),
})

type CalculatorDTO = ReturnType<typeof calculatorEncode>

interface CalculatorState {
    value: CalculatorDTO
}

export function createCalculatorStoreReduxRepo(
    calculator: Calculator
): CalculatorStoreRepo {
    const initialState: CalculatorState = {
        value: calculatorEncode(calculator),
    }

    const calculatorSlice = createSlice({
        name: "calculator",
        initialState,
        reducers: {
            save: (state, action: PayloadAction<CalculatorDTO>) => {
                state.value = action.payload
            },
        },
        selectors: {
            load: (state) => state.value,
        },
    })

    const store = configureStore({
        reducer: {
            calculator: calculatorSlice.reducer,
        },
        devTools: process.env.NODE_ENV !== "production",
    })

    return {
        getCalculator: () =>
            calculatorDecoder.verify(store.getState().calculator.value),
        setCalculator: (calculator) =>
            store.dispatch(
                calculatorSlice.actions.save(calculatorEncode(calculator))
            ),
    }
}
