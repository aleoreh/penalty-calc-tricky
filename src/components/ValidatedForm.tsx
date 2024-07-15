import Box from "@mui/material/Box"
import { ReactNode } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

type ValidatedFormProps = {
    reset: () => void
    children: ReactNode
}

export function ValidatedForm({ reset, children }: ValidatedFormProps) {
    return (
        <Box component="form" onReset={reset}>
            {children}
        </Box>
    )
}

