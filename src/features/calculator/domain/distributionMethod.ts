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
