/**
 * Метод распределения оплаты
 * fifo - оплата погашает долги начиная с самого раннего
 * byPaymentPeriod - сначала погашается целевой расчётный период,
 *  если он указан в платеже
 */
export type DistributionMethod = "fifo" | "byPaymentPeriod"

export function isDistributionMethod(
    value: string
): value is DistributionMethod {
    return value === "fifo" || value === "byPaymentPeriod"
}

export const distributionMethodShed = {
    isDistributionMethod,
}

export default distributionMethodShed
