import { TheStateConfig } from "./types"

export type TheStateConfigRepo = {
    getTheStateConfig: () => Promise<TheStateConfig>
}

export { type Calculator } from "./calculator"
