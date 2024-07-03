import { TheStateConstants } from "./types"

export type TheStateConstantsRepo = {
    getTheStateConstants: () => Promise<TheStateConstants>
}
