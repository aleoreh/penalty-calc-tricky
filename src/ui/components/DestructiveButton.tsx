import { Button, ButtonProps, Stack, StackProps, styled } from "@mui/material"

const StyledButton = styled(Button)<ButtonProps>(() => ({
    opacity: 0.6,
    textTransform: "lowercase",
}))

/**
 * Показывает, что кнопка может иметь деструктивное действие
 */
export function DestructiveButton(props: ButtonProps) {
    return (
        <StyledButton size="small" variant="text" {...props}>
            {props.children}
        </StyledButton>
    )
}

export function DestructiveStack(props: StackProps) {
    return (
        <Stack gap={0} {...props}>
            {props.children}
        </Stack>
    )
}
