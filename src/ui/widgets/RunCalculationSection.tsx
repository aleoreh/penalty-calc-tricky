import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { useApplication } from "@/ui/hooks/useApplication"
import { useDebts } from "../hooks/useDebts"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function RunCalculationSection() {
    const { debts } = useDebts()
    const { runCalculation } = useApplication()

    const calculationAllowed = debts.length > 0

    const handleRunCalculation = () => {
        const calculationResults = runCalculation()
    }

    return (
        <Stack>
            <Button
                type="button"
                onClick={handleRunCalculation}
                disabled={!calculationAllowed}
            >
                Рассчитать
            </Button>
        </Stack>
    )
}
