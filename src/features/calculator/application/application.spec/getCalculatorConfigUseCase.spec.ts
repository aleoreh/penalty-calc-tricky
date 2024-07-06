import { it } from "@fast-check/vitest"
import { Arbitrary, constant, date, oneof } from "fast-check"
import { describe, expect } from "vitest"
import { LegalEntity } from "../../domain/calculator-config"
import theStateConstantsStaticRepo from "../../infrastructure/theStateConstantsStaticRepo"
import { createGetCalculatorConfigUseCase } from "../getCalculatorConfigUseCase"

const dateArb = date({ min: new Date("1900-01-01") })
const legalEntityArb: Arbitrary<LegalEntity> = oneof(
    constant<"natural">("natural"),
    constant<"artificial">("artificial")
)

const repo = theStateConstantsStaticRepo

const getCalculatorConfig = createGetCalculatorConfigUseCase(repo)

describe("Сценарий GetCalculatorConfigUseCase", () => {
    it.prop([dateArb, legalEntityArb])(
        "может получить CalculatorConfig с помощью репозитория TheStateConstantsRepo",
        async (date, legalEntity) => {
            const config = await getCalculatorConfig(date, legalEntity)

            expect(config.legalEntity).toBe(legalEntity)
        }
    )

    it.prop([dateArb, legalEntityArb.filter((x) => x === "artificial")])(
        "при порядке расчета для юридических лиц получает конфигурацию без отсрочки",
        async (date, legalEntity) => {
            const config = await getCalculatorConfig(date, legalEntity)

            expect(config.deferredDaysCount).toBe(0)
        }
    )
})
