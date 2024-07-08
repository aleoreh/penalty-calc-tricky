import { it } from "@fast-check/vitest"
import { describe, expect } from "vitest"
import { createCreateCalculatorsUseCase } from "../application/createCalculatorUseCase"
import { theStateConstantsStaticRepo as theStateConstantsRepo } from "../infrastructure/theStateConstantsStaticRepo"

const initialiseCalculator = createCreateCalculatorsUseCase(
    theStateConstantsRepo
)

describe("Запуск приложения", () => {
    it("Инициализирует калькулятор", async () => {
        const calculator = await initialiseCalculator()

        expect(calculator.undistributedRemainder).toEqual(0)
        expect(calculator.debts.length).toEqual(0)
        expect(calculator.payments.length).toEqual(0)
    })
})
