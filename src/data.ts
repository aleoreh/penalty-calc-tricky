// действующий ключевые ставки (дата, значение)
export const keyRates = [["1900-01-01", 0.095]] as [string, number][]

// действующие моратории (начало, конец)
export const moratoriums = [
    ["2020-04-06", "2021-01-01"],
    ["2022-03-31", "2022-10-01"],
] as [string, string][]

// количество дней, отведенное на оплату
export const daysToPay = 10

// отсрочка платежа по пене
export const deferredDaysCount = 30

// день, после которого наступает изменение доли ставки расчета пени
export const fractionChangeDay = 90

