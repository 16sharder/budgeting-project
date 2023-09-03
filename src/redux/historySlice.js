import { createSlice } from '@reduxjs/toolkit'

export const recentAccountSlice = createSlice({
    name: 'recentAccount',
    initialState: {
        value: ""
    },
    reducers: {
        setRecent(state, action) {
            state.value = action.payload
        },
    }
})

export const { setRecent } = recentAccountSlice.actions

export const linkSlice = createSlice({
    name: 'backtrackLink',
    initialState: {
        value: ""
    },
    reducers: {
        setLink(state, action) {
            state.value = action.payload
        },
    }
})

export const { setLink } = linkSlice.actions

const recentAccountReducer = recentAccountSlice.reducer
const backtrackLinkReducer = linkSlice.reducer

export {recentAccountReducer, backtrackLinkReducer}