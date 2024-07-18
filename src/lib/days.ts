export const endOfPeriod = (date: Date, part: "month" | "year"): Date => {
    switch (part) {
        case "year":
            return new Date(Date.UTC(date.getFullYear(), 12, 0))
        case "month":
            return new Date(
                Date.UTC(date.getFullYear(), date.getMonth() + 1, 0)
            )
    }
}

export const beginOfPeriod = (date: Date, part: "month" | "year"): Date => {
    switch (part) {
        case "year":
            return new Date(Date.UTC(date.getFullYear(), 0, 1))
        case "month":
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1))
    }
}

export const addDay = (date: Date, count?: number): Date => {
    const res = new Date(date)
    res.setDate(date.getDate() + (count === undefined ? 1 : Math.round(count)))
    return res
}

export const daysEqual = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    )
}

export const compareDays = (date1: Date, date2: Date): Ordering => {
    const startOfDay1 = new Date(
        Date.UTC(
            date1.getFullYear(),
            date1.getMonth(),
            date1.getDate(),
            0,
            0,
            0
        )
    )
    const startOfDay2 = new Date(
        Date.UTC(
            date2.getFullYear(),
            date2.getMonth(),
            date2.getDate(),
            0,
            0,
            0
        )
    )
    if (startOfDay1.getTime() < startOfDay2.getTime()) {
        return "LT"
    } else if (startOfDay1.getTime() > startOfDay2.getTime()) {
        return "GT"
    } else {
        return "EQ"
    }
}

export function daysDelta(date1: Date, date2: Date): number {
    // https://stackoverflow.com/a/12863278
    const greg = (y0: number, m0: number, d0: number) => {
        const m = Math.floor((m0 + 9) % 12)
        const y = y0 - Math.floor(m / 10)
        return (
            365 * y +
            Math.floor(y / 4) -
            Math.floor(y / 100) +
            Math.floor(y / 400) +
            Math.floor((m * 306 + 5) / 10) +
            (d0 - 1)
        )
    }

    return (
        greg(date2.getFullYear(), date2.getMonth() + 1, date2.getDate()) -
        greg(date1.getFullYear(), date1.getMonth() + 1, date1.getDate())
    )
}

export const daysShed = {
    add: addDay,
    beginOfPeriod,
    endOfPeriod,
    equals: daysEqual,
    compare: compareDays,
    delta: daysDelta,
}

export default daysShed

