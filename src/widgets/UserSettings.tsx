import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { useRegularText } from "../components/useRegularText"
import { useUserSettings } from "../hooks/useUserSettings"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function UserSettings() {
    const userSettingsInfo = useRegularText()
    const { settings } = useUserSettings()

    return (
        <Stack direction="row">
            <Typography {...userSettingsInfo}>
                {JSON.stringify(settings, undefined, 2)}
            </Typography>
        </Stack>
    )
}
