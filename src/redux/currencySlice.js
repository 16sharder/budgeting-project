import { createSlice } from '@reduxjs/toolkit'

export const currencySlice = createSlice({
  name: 'currency',
  initialState: {
    value: "EUR",
    symbol: "€"
  },
  reducers: {
    toEuro(state) {
        state.value = "EUR"
        state.symbol = "€"
    },
    toDollar(state) {
        state.value = "USD"
        state.symbol = "$"
    }
  }
})

// Action creators are generated for each case reducer function
export const { toEuro, toDollar } = currencySlice.actions

export default currencySlice.reducer