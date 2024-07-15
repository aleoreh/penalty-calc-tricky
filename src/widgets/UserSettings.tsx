import { Edit } from "@mui/icons-material"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import TextField from "@mui/material/TextField"
import { string } from "decoders"
import { ModalForm } from "../components/ModalForm"
import { useModalForm } from "../components/useModalForm"
import { useRegularText } from "../components/useRegularText"
import { useSectionTitle } from "../components/useSectionTitle"
import { useValidatedForm } from "../components/useValidatedForm"
import { useValidatedInput } from "../components/useValidatedInput"
import { useUserSettings } from "../hooks/useUserSettings"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function UserSettings() {
    const userSettingsInfo = useRegularText()
    const userSettingsTitle = useSectionTitle()
    const { view } = useUserSettings()
    const field = useValidatedInput(
        string.refine((x) => x === "hello", "Здесь должно быть слово hello")
    )
    const validatedForm = useValidatedForm([field])
    const modalForm = useModalForm()

    return (
        <>
            <Typography {...userSettingsTitle}>Настройки расчёта</Typography>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography {...userSettingsInfo}>
                    {`${[
                        view.legalEntity,
                        view.distributionMethod,
                        view.keyRate,
                    ].join("; ")}`}
                </Typography>
                <IconButton onClick={modalForm.open}>
                    <Edit />
                </IconButton>
            </Stack>
            <ModalForm
                title="Диалог"
                {...modalForm}
                {...validatedForm}
                submit={() => {
                    console.log(field.validatedValue)
                }}
                submitAndContinue={() => {}}
            >
                <TextField {...field.input} title="Значение" required/>
                <Typography>{field.validatedValue}</Typography>
            </ModalForm>
        </>
    )
}

