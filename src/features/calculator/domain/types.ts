export type KeyRate = number

export type TheStateConstants = {
    daysToPay: number
    deferredDaysCount: number
    fractionChangeDay: number
    keyRates: [DateString, KeyRate][]
    moratoriums: [DateString, DateString][]
}

