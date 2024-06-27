import { TheStateConfig } from "./types"

export type TheStateConfigRepo = {
    getTheStateConfig: () => Promise<TheStateConfig>
}
