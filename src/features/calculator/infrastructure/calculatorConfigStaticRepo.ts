import {
    daysToPay,
    deferredDaysCount,
    fractionChangeDay,
    keyRates,
    moratoriums,
} from "@/data"
import { TheStateConfigRepo } from "../domain"
import { TheStateConfig } from "../domain/types"

async function getTheStateConfig(): Promise<TheStateConfig> {
    return {
        daysToPay,
        deferredDaysCount,
        fractionChangeDay,
        keyRates,
        moratoriums,
    }
}

export const theStateConfigStaticRepo: TheStateConfigRepo = {
    getTheStateConfig: getTheStateConfig,
}

export default theStateConfigStaticRepo
