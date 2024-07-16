import { Edit } from "@mui/icons-material"
import FormControl from "@mui/material/FormControl"
import IconButton from "@mui/material/IconButton"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useState } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { ModalForm } from "../components/ModalForm"
import { useModalForm } from "../components/useModalForm"
import { useRegularText } from "../components/useRegularText"
import { useSectionTitle } from "../components/useSectionTitle"
import { useValidatedForm } from "../components/useValidatedForm"
import { useValidatedInput } from "../components/useValidatedInput"
import { useCalculationSettings } from "../hooks/useCalculationSettings"
import { useCalculationSettingsFormat } from "../hooks/useCalculationSettingsFormat"
import { validationDecoders } from "../validation/validationDecoders"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function UserSettings() {
    const userSettingsInfo = useRegularText()
    const userSettingsTitle = useSectionTitle()

    const settings = useCalculationSettings()
    const { isLegalEntity, isDistributionMethod, setUserSettings } = settings

    const view = useCalculationSettingsFormat(settings)

    const [inputLegalEntity, setInputLegalEntity] = useState(
        settings.legalEntity
    )
    const [inputDistributionMethod, setInputDistributionMethod] = useState(
        settings.distributionMethod
    )

    const legalEntityInput = useValidatedInput(
        settings.legalEntity,
        validationDecoders.nonEmptyString
    )
    const distributionMethodInput = useValidatedInput(
        settings.distributionMethod,
        validationDecoders.nonEmptyString
    )
    const keyRateInput = useValidatedInput(
        settings.calculationKeyRate === undefined
            ? undefined
            : String(settings.calculationKeyRate * 100),
        validationDecoders.decimal.transform((x) => x / 100)
    )
    const validatedForm = useValidatedForm([
        legalEntityInput,
        distributionMethodInput,
        keyRateInput,
    ])
    const modalForm = useModalForm()

    const handleLegalEntityChange = (event: SelectChangeEvent) => {
        isLegalEntity(event.target.value) &&
            setInputLegalEntity(event.target.value)
    }

    const handleDistributionMethodChange = (event: SelectChangeEvent) => {
        isDistributionMethod(event.target.value) &&
            setInputDistributionMethod(event.target.value)
    }

    const submit = () => {
        setUserSettings({
            legalEntity: inputLegalEntity,
            distributionMethod: inputDistributionMethod,
            calculationKeyRate: keyRateInput.validatedValue,
        })
    }

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
                title="Настройки"
                {...modalForm}
                {...validatedForm}
                submit={submit}
            >
                <Stack>
                    <FormControl>
                        <InputLabel id="legal-entity-input-label">
                            Порядок расчёта
                        </InputLabel>
                        <Select
                            labelId="legal-entity-input-label"
                            id="legal-entity-input"
                            value={inputLegalEntity}
                            label="Порядок расчёта"
                            onChange={handleLegalEntityChange}
                        >
                            <MenuItem value="natural">Физические лица</MenuItem>
                            <MenuItem value="artificial">
                                Юридические лица
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="distribution-method-input-label">
                            Метод распределения
                        </InputLabel>
                        <Select
                            labelId="distribution-method-input-label"
                            id="distribution-method-input"
                            value={inputDistributionMethod}
                            label="Метод распределения"
                            onChange={handleDistributionMethodChange}
                        >
                            <MenuItem value="fifo">
                                {view.distributionMethods["fifo"]}
                            </MenuItem>
                            <MenuItem value="byPaymentPeriod">
                                {view.distributionMethods["byPaymentPeriod"]}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        {...keyRateInput.input}
                        label="Ключевая ставка, %"
                        required
                    />
                </Stack>
            </ModalForm>
        </>
    )
}

