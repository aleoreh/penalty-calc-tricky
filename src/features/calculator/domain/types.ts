export type KeyRate = number

export type TheStateConstants = {
    daysToPay: number
    deferredDaysCount: number
    fractionChangeDay: number
    keyRates: [Date, KeyRate][]
    moratoriums: [DateString, DateString][]
}

