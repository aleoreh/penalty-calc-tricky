import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { CalculationConfig } from "@/ui/widgets/CalculationConfig"
import { DebtsList } from "@/ui/widgets/DebtsList"
import { InputCalculationDate } from "@/ui/widgets/InputCalculationDate"
import { PaymentsList } from "@/ui/widgets/PaymentsList"
import { UserSettings } from "@/ui/widgets/UserSettings"

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
                    <PaymentsList />
                </Stack>
            </Container>
        </Box>
    )
}

