[Назад в README](./README.md)
## Как добавить сценарий приложения

- Создать тип сценария в `domain/inex.ts`
- Создать модуль сценария: `application/usecase.ts`
- Добавить модуль в конструктор сценариев: `application/index.ts`

## Как создать hook на основе `useApplication`

```typescript
export function useCalculationSettings() {
    const { calculator, dispatch, applyUserSettings } = useApplication()

    const setUserSettings = (
        ...params: Parameters<typeof applyUserSettings>
    ) => {
        dispatch(() => applyUserSettings(...params))
    }

    return {
        setUserSettings,
        legalEntity: calculator.config.legalEntity,
        distributionMethod: calculator.userSettings.distributionMethod,
        calculationKeyRate: getKeyRate(calculator, calculator.calculationDate),
        isLegalEntity,
        isDistributionMethod,
    }
}
```
