import Opaque, * as O from "ts-opaque"

export type Kopek = Opaque<number, "Kopek">

export function numberAsKopek(x: number): Kopek {
    return O.create(x)
}

export function kopekAsNumber(x: Kopek): number {
    return O.widen(x)
}

export const kopekFromRuble = (x: number): Kopek => {
    return O.create(Math.round(x * 100))
}

export const kopekToRuble = (x: Kopek): number => {
    return O.widen(x) / 100
}

export function addKopeks(...xs: Kopek[]): Kopek {
    return xs.reduce((acc, x) => acc + x, 0) as Kopek
}

export function subtractKopeks(x: Kopek, y: Kopek): Kopek {
    return (x - y) as Kopek
}

export function multiplyKopeks(...xs: Kopek[]): Kopek {
    return xs.reduce((acc, x) => acc * x, 0) as Kopek
}

export function multiplyKopekByScalar(scalar: number) {
    return (x: Kopek): Kopek => (scalar * x) as Kopek
}

export const kopekShed = {
    asKopek: numberAsKopek,
    asNumber: kopekAsNumber,
    fromRuble: kopekFromRuble,
    toRuble: kopekToRuble,
    add: addKopeks,
    subtract: subtractKopeks,
    multiply: multiplyKopeks,
    multiplyByScalar: multiplyKopekByScalar,
}

export default kopekShed

