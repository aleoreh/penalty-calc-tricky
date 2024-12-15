/**
 * Доля ключевой ставки для расчёта
 *
 * Меняется в зависимости от количества просроченных дней
 */
export type KeyRatePart = {
    numerator: number
    denominator: number
}

export function getKeyRatePartNumericValue(keyRatePart: KeyRatePart) {
    return keyRatePart.numerator / keyRatePart.denominator
}

export function keyRatePartEquals(
    value1: KeyRatePart,
    value2: KeyRatePart
): boolean {
    return (
        value1.numerator === value2.numerator &&
        value1.denominator === value2.denominator
    )
}

export const keyRatePartShed = {
    equals: keyRatePartEquals,
    getNumericValue: getKeyRatePartNumericValue,
}

export default keyRatePartShed

