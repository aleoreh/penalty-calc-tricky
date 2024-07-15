import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { CalculationConfig } from "../widgets/CalculationConfig"
import { DebtsList } from "../widgets/DebtsList"
import { InputCalculationDate } from "../widgets/InputCalculationDate"
import { UserSettings } from "../widgets/UserSettings"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function Home() {
    return (
        <Box>
            <Container>
                <Stack>
                    <UserSettings />
                    <CalculationConfig />
                    <InputCalculationDate />
                    <DebtsList />
                </Stack>
            </Container>
        </Box>
    )
}

