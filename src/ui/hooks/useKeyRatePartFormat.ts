import { KeyRatePart } from "../../features/calculator/domain/keyrate-part"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function useKeyRatePartFormat() {
    const formatKeyRatePart = (value: KeyRatePart): string =>
        `${value.numerator}/${value.denominator}`

    return { formatKeyRatePart }
}
