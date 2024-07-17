import { Edit } from "@mui/icons-material"
import FormControl from "@mui/material/FormControl"
import IconButton from "@mui/material/IconButton"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useState } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { nonEmptyString } from "decoders"
import { ModalForm } from "../components/ModalForm"
import { useModalForm } from "../components/useModalForm"
import { useRegularText } from "../components/useRegularText"
import { useSectionTitle } from "../components/useSectionTitle"
import { useValidatedTextField } from "../components/useValidatedTextField"
import { useCalculationSettings } from "../hooks/useCalculationSettings"
import { useCalculationSettingsFormat } from "../hooks/useCalculationSettingsFormat"
import { useAppForm } from "../validation/useAppForm"
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

    // ~~~~~~~~~~~~~~~~ форма ~~~~~~~~~~~~~~~~ //

    // const legalEntityInput = useValidatedInput(
    //     settings.legalEntity,
    //     validationDecoders.nonEmptyString
    // )
    // const distributionMethodInput = useValidatedInput(
    //     settings.distributionMethod,
    //     validationDecoders.nonEmptyString
    // )
    // const keyRateInput = useValidatedInput(
    //     settings.calculationKeyRate === undefined
    //         ? undefined
    //         : String(settings.calculationKeyRate * 100),
    //     validationDecoders.decimal.transform((x) => x / 100)
    // )
    // const validatedForm = useValidatedForm([
    //     legalEntityInput,
    //     distributionMethodInput,
    //     keyRateInput,
    // ])

    // ~~~~~~~~~~~~~~ alt форма ~~~~~~~~~~~~~~ //

    const legalEntityAltInput = useValidatedTextField({
        name: "legal-entity",
        decoder: nonEmptyString.refine(
            (value) => isLegalEntity(value),
            `Недопустимое значение`
        ),
        initialValue: settings.legalEntity,
    })

    const distributionMethodAltInput = useValidatedTextField({
        name: "distribution-method",
        decoder: nonEmptyString.refine(
            (value) => isDistributionMethod(value),
            `Недопустимое значение`
        ),
        initialValue: settings.distributionMethod,
    })

    const keyRateAltInput = useValidatedTextField({
        name: "key-rate",
        decoder: validationDecoders.decimal.transform((x) => x / 100),
        initialValue:
            settings.calculationKeyRate === undefined
                ? undefined
                : String(settings.calculationKeyRate * 100),
    })

    const userSettingsForm = useAppForm([
        legalEntityAltInput,
        distributionMethodAltInput,
        keyRateAltInput,
    ])

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    const modalForm = useModalForm()

    const submit = () => {
        setUserSettings({
            legalEntity: legalEntityAltInput.validatedValue,
            distributionMethod: distributionMethodAltInput.validatedValue,
            calculationKeyRate: keyRateAltInput.validatedValue,
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
                {...userSettingsForm}
                submit={submit}
            >
                <Stack>
                    <FormControl>
                        <InputLabel id="legal-entity-input-label">
                            Порядок расчёта
                        </InputLabel>
                        <Select
                            {...legalEntityAltInput.input}
                            labelId="legal-entity-input-label"
                            id="legal-entity-input"
                            label="Порядок расчёта"
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
                            {...distributionMethodAltInput.input}
                            labelId="distribution-method-input-label"
                            id="distribution-method-input"
                            label="Метод распределения"
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
                        {...keyRateAltInput.input}
                        label="Ключевая ставка, %"
                        required
                    />
                </Stack>
            </ModalForm>
        </>
    )
}

