/**
 * Правовая форма абонента
 *
 * natural - физическое лицо
 *
 * artificial - юридическое лицо
 */
export type LegalEntity = "natural" | "artificial"

export function isLegalEntity(value: string): value is LegalEntity {
    return value === "natural" || value === "artificial"
}

export const legalEntityShed = {
    isLegalEntity,
}

export default legalEntityShed

