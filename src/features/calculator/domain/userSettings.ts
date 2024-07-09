import { DistributionMethod } from "./calculator"
import { LegalEntity } from "./calculator-config"

const DEFAULT_USER_SETTINGS: UserSettings = {
    distributionMethod: "fifo",
    legalEntity: "natural",
}

export type UserSettings = {
    distributionMethod: DistributionMethod
    legalEntity: LegalEntity
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

export const userSettingsShed = {
    init: initUserSettings,
}

export default userSettingsShed

