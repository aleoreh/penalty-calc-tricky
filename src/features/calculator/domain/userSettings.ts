import { DistributionMethod } from "./calculator"
import { LegalEntity } from "./calculator-config"
import { KeyRate } from "./types"

const DEFAULT_USER_SETTINGS: UserSettings = {
    distributionMethod: "fifo",
    legalEntity: "natural",
}

export type UserSettings = {
    distributionMethod: DistributionMethod
    legalEntity: LegalEntity
    calculationKeyRate?: KeyRate
}

export function initUserSettings(
    distributionMethod?: DistributionMethod,
    legalEntity?: LegalEntity
): UserSettings {
    return {
        distributionMethod:
            distributionMethod || DEFAULT_USER_SETTINGS.distributionMethod,
        legalEntity: legalEntity || DEFAULT_USER_SETTINGS.legalEntity,
    }
}

export function withCalculationKeyRate(keyRate: KeyRate) {
    return (userSettings: UserSettings): UserSettings => {
        return {
            ...userSettings,
            calculationKeyRate: keyRate,
        }
    }
}

export const userSettingsShed = {
    init: initUserSettings,
    withCalculationKeyRate
}

export default userSettingsShed

