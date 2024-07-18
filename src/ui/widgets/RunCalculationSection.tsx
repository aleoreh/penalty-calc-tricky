import { Close } from "@mui/icons-material"
import {
    AppBar,
    Button,
    Container,
    Dialog,
    IconButton,
    Slide,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material"
import { TransitionProps } from "@mui/material/transitions"
import { forwardRef } from "react"
import { CalculationResults } from "./CalculationResults"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { useApplication } from "@/ui/hooks/useApplication"
import { useCalculationResults } from "@/ui/hooks/useCalculationResults"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />
})

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
            <Stack direction="row" justifyContent="flex-end">
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
                TransitionComponent={Transition}
            >
                <AppBar
                    variant="outlined"
                    sx={({ palette }) => ({
                        position: "sticky",
                        backgroundColor: palette.background.default,
                        border: "none",
                    })}
                >
                    <Toolbar sx={{ justifyContent: "flex-end" }}>
                        <IconButton edge="end" onClick={handleDialogClose}>
                            <Close />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container>
                    <Stack>
                        <Typography variant="h5">Результат расчёта</Typography>
                    </Stack>
                </Container>
                <CalculationResults
                    calculationDate={calculator.calculationDate}
                    calculationResults={calculationResults}
                />
            </Dialog>
        </>
    )
}

