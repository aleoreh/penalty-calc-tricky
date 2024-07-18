import { FileDownloadOutlined } from "@mui/icons-material"
import {
    Button,
    Container,
    List,
    ListItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material"
import { useEffect, useState } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { CalculationResult } from "@/ui/hooks/useCalculationResults"
import dayjs from "dayjs"
import { CalculationResultItem } from "../../features/calculator/domain/calculation-result"
import kopekShed, { Kopek, kopekToRuble, numberAsKopek } from "../../lib/kopek"
import { formatCurrency, formatPercent, formatPeriod } from "../../lib/utils"
import { useCalculationResult } from "../hooks/useCalculationResult"
import { useCalculationResultDownload } from "../hooks/useCalculationResultsDownload"
import { useKeyRatePartFormat } from "../hooks/useKeyRatePartFormat"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// ~~~~~~~~~ CalculationResultRow ~~~~~~~~ //

type CalculationResultRowProps = {
    item: CalculationResultItem
    index: number
}

const CalculationResultRow = ({ item, index }: CalculationResultRowProps) => {
    const { formatKeyRatePart } = useKeyRatePartFormat()

    return (
        <TableRow key={index} className="calculation-result-row">
            <TableCell align="right">
                {formatCurrency(kopekToRuble(item.debtAmount))}
            </TableCell>
            <TableCell>{dayjs(item.dateFrom).format("L")}</TableCell>
            <TableCell>{dayjs(item.dateTo).format("L")}</TableCell>
            <TableCell>{item.totalDays}</TableCell>
            <TableCell>{formatKeyRatePart(item.ratePart)}</TableCell>
            <TableCell>{formatPercent(item.rate)}</TableCell>
            <TableCell
                sx={(theme) => ({
                    fontSize: theme.typography.caption,
                })}
            >
                {item.formula}
            </TableCell>
            <TableCell align="right">
                {formatCurrency(kopekToRuble(item.penaltyAmount))}
            </TableCell>
        </TableRow>
    )
}

// ~~~~~~~~~~ CalculationResult ~~~~~~~~~~ //

type CalculationResultProps = {
    calculationDate: Date
    calculationResult: CalculationResult
}

const CalculationResultComponent = ({
    calculationDate,
    calculationResult,
}: CalculationResultProps) => {
    const fields = [
        "Сумма долга",
        "Период с",
        "Период по",
        "Всего дней",
        "Доля ставки",
        "Ставка",
        "Расчет",
        "Сумма пени",
    ]

    const { downloadCalculationResult } = useCalculationResultDownload()

    // ~~~~~~~~~~~~~~~ download ~~~~~~~~~~~~~~ //

    const [downloadTrigger, setDownloadTrigger] = useState(false)

    useEffect(() => {
        async function download() {
            await downloadCalculationResult(
                calculationDate,
                calculationResult
            ).finally(() => {
                setDownloadTrigger(false)
            })
        }

        if (!downloadTrigger) return

        download()
    }, [
        calculationDate,
        calculationResult,
        calculationResult.rows,
        downloadCalculationResult,
        downloadTrigger,
    ])

    // ~~~~~~~~~~~~~~~~~ jsx ~~~~~~~~~~~~~~~~~ //

    return (
        <Stack className="calculation-result">
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography variant="h6">
                    {formatPeriod(calculationResult.period)}
                </Typography>
                <Button
                    onClick={() => {
                        setDownloadTrigger(true)
                    }}
                >
                    Сохранить расчет за {formatPeriod(calculationResult.period)}
                </Button>
            </Stack>
            <TableContainer className="calculation-result">
                <Table>
                    <TableHead>
                        <TableRow>
                            {fields.map((field) => (
                                <TableCell>{field}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {calculationResult.rows.map((item, i) => (
                            <CalculationResultRow
                                key={i}
                                item={item}
                                index={i}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    )
}

// ~~~~~~~~~~ CalculationResults ~~~~~~~~~ //

type CalculationResultsProps = {
    calculationDate: Date
    calculationResults: CalculationResult[]
}

export function CalculationResults({
    calculationDate,
    calculationResults,
}: CalculationResultsProps) {
    // ~~~~~~~~~~~~~~~ download ~~~~~~~~~~~~~~ //

    const [downloadTrigger, setDownloadTrigger] = useState(false)

    const { getTotalAmount } = useCalculationResult()

    const { downloadCalculationResults } = useCalculationResultDownload()

    useEffect(() => {
        async function download() {
            await downloadCalculationResults(
                calculationDate,
                calculationResults
            ).finally(() => {
                setDownloadTrigger(false)
            })
        }

        if (!downloadTrigger) return

        download()
    }, [
        calculationDate,
        calculationResults,
        downloadCalculationResults,
        downloadTrigger,
    ])

    const calculationResultsTotal = (
        calculationResults: CalculationResult[]
    ): Kopek => {
        return calculationResults.reduce(
            (acc, calculationResult) =>
                kopekShed.add(acc, getTotalAmount(calculationResult)),
            numberAsKopek(0)
        )
    }

    // ~~~~~~~~~~~~~~~~~ jsx ~~~~~~~~~~~~~~~~~ //

    return calculationResults.length > 0 ? (
        <Container>
            <Stack className="calculation-results">
                <Button
                    onClick={() => setDownloadTrigger(true)}
                    sx={{ alignSelf: "flex-end" }}
                    startIcon={<FileDownloadOutlined />}
                >
                    Сохранить все расчёты
                </Button>
                <List>
                    {calculationResults.map((calculationResult) => (
                        <ListItem key={calculationResult.period.getTime()}>
                            <CalculationResultComponent
                                calculationDate={calculationDate}
                                calculationResult={calculationResult}
                            />
                        </ListItem>
                    ))}
                </List>
                <Typography variant="h5" align="right">
                    Итого:{" "}
                    {formatCurrency(
                        kopekToRuble(
                            calculationResultsTotal(calculationResults)
                        )
                    )}
                </Typography>
            </Stack>
        </Container>
    ) : (
        <></>
    )
}
