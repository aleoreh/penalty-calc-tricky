import {
    daysToPay,
    deferredDaysCount,
    fractionChangeDay,
    keyRates,
    moratoriums,
} from "@/data"
import { type TheStateConstantsRepo } from "../domain"

async function getTheStateConstants() {
    return {
        daysToPay,
        deferredDaysCount,
        fractionChangeDay,
        keyRates: keyRates.map(([dateString, value]) => {
            return [new Date(dateString), value] as [Date, number]
        }),
        moratoriums,
    }
}

export const theStateConstantsStaticRepo: TheStateConstantsRepo = {
    getTheStateConstants,
}

export default theStateConstantsStaticRepo
