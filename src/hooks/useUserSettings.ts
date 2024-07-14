import { useState } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { useApplication } from "../contexts/applicationContextHook"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function useUserSettings() {
    const { useCases } = useApplication()
    type Params = Parameters<typeof useCases.applyUserSettings>
    const [calculator, setCalculator] = useState(useCases.getCalculator())

    return {
        settings: calculator.userSettings,
        setSettings: ([settings]: Params) => {
            useCases.applyUserSettings(settings)
            setCalculator(useCases.getCalculator())
        },
    }
}
