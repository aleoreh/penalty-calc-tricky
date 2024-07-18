import { DistributionMethod } from "../../features/calculator/domain/distributionMethod"
import { LegalEntity } from "../../features/calculator/domain/legalEntity"
import { useCalculationSettings } from "./useCalculationSettings"

const legalEntities: Record<LegalEntity, string> = {
    natural: "Физические лица",
    artificial: "Юридические лица",
}

const distributionMethods: Record<DistributionMethod, string> = {
    fifo: "Первым - ранее возникший",
    byPaymentPeriod: "Первым - период оплаты",
}

export function useCalculationSettingsFormat(
    settings: ReturnType<typeof useCalculationSettings>
) {
    const { legalEntity, distributionMethod, calculationKeyRate } = settings
    return {
        legalEntity: legalEntities[legalEntity],
        distributionMethod: distributionMethods[distributionMethod],
        keyRate: new Intl.NumberFormat("ru-RU", {
            style: "percent",
            minimumFractionDigits: 2,
        }).format(calculationKeyRate),
        legalEntities,
        distributionMethods,
    }
}
