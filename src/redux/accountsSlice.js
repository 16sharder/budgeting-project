import { createSlice } from '@reduxjs/toolkit'

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState: {
    value: []
  },
  reducers: {
    setAccounts(state, action) {
      state.value = action.payload
    }
  }
})

export const { setAccounts } = accountsSlice.actions

export default accountsSlice.reducer