import { DistributionMethod } from "./calculator"
import { LegalEntity } from "./calculator-config"

export type UserSettings = {
    distributionMethod: DistributionMethod
    legalEntity: LegalEntity
}

export function initUserSettings(
    distributionMethod: DistributionMethod,
    legalEntity: LegalEntity
): UserSettings {
    return {
        distributionMethod,
        legalEntity,
    }
}

export const userSettingsShed = {
    init: initUserSettings,
}

export default userSettingsShed
