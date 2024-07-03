export type KeyRate = number

export type TheStateConfig = {
    daysToPay: number
    deferredDaysCount: number
    fractionChangeDay: number
    keyRates: [DateString, KeyRate][]
    moratoriums: [DateString, DateString][]
}

