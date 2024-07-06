import { it } from "@fast-check/vitest"
import { Arbitrary, constant, date, oneof } from "fast-check"
import { describe, expect } from "vitest"
import calculatorShed from "../../domain/calculator"
import { LegalEntity } from "../../domain/calculator-config"
import { calculatorStoreSimpeRepo } from "../../infrastructure/calculatorStoreSimpeRepo"
import theStateConstantsStaticRepo from "../../infrastructure/theStateConstantsStaticRepo"
import { createGetCalculatorConfigUseCase } from "../getCalculatorConfigUseCase"
import { createSetCalculatorUseCase } from "../setCalculatorUseCase"

const dateArb = date({ min: new Date("1900-01-01") })
const legalEntityArb: Arbitrary<LegalEntity> = oneof(
    constant<"natural">("natural"),
    constant<"artificial">("artificial")
)
const stateConstantsRepo = theStateConstantsStaticRepo
const calculatorStoreRepo = calculatorStoreSimpeRepo

const getCalculatorConfig = createGetCalculatorConfigUseCase(stateConstantsRepo)
const setCalculator = createSetCalculatorUseCase(calculatorStoreRepo)

describe("Сценарий SetCalculatorConfigUseCase", () => {
    it.prop([dateArb, legalEntityArb])(
        "сохраняет конфигурацию в хранилище",
        async (date, legalEntity) => {
            const config = await getCalculatorConfig(date, legalEntity)
            const calculator = calculatorShed.init(date, config, "fifo")
            await setCalculator(config, calculator)
            const savedCalculator = await calculatorStoreRepo.getCalculator()

            expect(savedCalculator).toEqual({
                ...calculator,
                distributionMethod: "fifo",
            })
        }
    )
})
