import { TypographyProps } from "@mui/material"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function useAppTitle(): TypographyProps {
    return {
        component: "h1",
        variant: "h6",
    }
}
