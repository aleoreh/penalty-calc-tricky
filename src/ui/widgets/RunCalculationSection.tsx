import { Close } from "@mui/icons-material"
import {
    AppBar,
    Button,
    Dialog,
    IconButton,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { useApplication } from "@/ui/hooks/useApplication"
import { useCalculationResults } from "@/ui/hooks/useCalculationResults"
import { CalculationResults } from "./CalculationResults"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function RunCalculationSection() {
    const {
        calculate,
        calculationAllowed,
        calculationResults,
        clearCalculationResults,
    } = useCalculationResults()

    const { calculator } = useApplication()

    const isResultOpened = calculationResults.length > 0

    const handleDialogClose = () => {
        clearCalculationResults()
    }

    return (
        <>
            <Stack>
                <Button
                    type="button"
                    onClick={calculate}
                    disabled={!calculationAllowed}
                >
                    Рассчитать
                </Button>
            </Stack>
            <Dialog
                fullScreen
                open={isResultOpened}
                onClose={handleDialogClose}
            >
                <AppBar sx={{ position: "relative" }}>
                    <Toolbar>
                        <Typography sx={{ flex: 1 }}>
                            Результат расчёта пеней
                        </Typography>
                        <IconButton
                            edge="end"
                            onClick={handleDialogClose}
                            color="inherit"
                        >
                            <Close />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <CalculationResults
                    calculationDate={calculator.calculationDate}
                    calculationResults={calculationResults}
                />
            </Dialog>
        </>
    )
}

