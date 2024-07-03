import {
    daysToPay,
    deferredDaysCount,
    fractionChangeDay,
    keyRates,
    moratoriums,
} from "@/data"
import { TheStateConstantsRepo } from "../domain"
import { TheStateConstants } from "../domain/types"

async function getTheStateConstants(): Promise<TheStateConstants> {
    return {
        daysToPay,
        deferredDaysCount,
        fractionChangeDay,
        keyRates,
        moratoriums,
    }
}

export const theStateConstantsStaticRepo: TheStateConstantsRepo = {
    getTheStateConstants: getTheStateConstants,
}

export default theStateConstantsStaticRepo
