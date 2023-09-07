import { createSlice } from '@reduxjs/toolkit'

export const recentAccountSlice = createSlice({
    name: 'recentAccount',
    initialState: {
        value: ""
    },
    reducers: {
        setRecent(state, action) {
            state.value = action.payload
        }
    }
})

export const { setRecent } = recentAccountSlice.actions

export const linkSlice = createSlice({
    name: 'backtrackLink',
    initialState: {
        value: "",
        args: {}
    },
    reducers: {
        resetLink(state){
            state.value = []
            state.args = []
        },
        pushLink(state, action) {
            const object = action.payload

            const links = state.value.slice()
            const args = state.args.slice()

            links.push(object.link)
            args.push(object.state)

            state.value = links
            state.args = args
        },
        popLink(state) {
            const links = state.value.slice()
            const args = state.args.slice()

            links.pop()
            args.pop()

            state.value = links
            state.args = args
        }
    }
})

export const { resetLink, pushLink, popLink } = linkSlice.actions

const recentAccountReducer = recentAccountSlice.reducer
const backtrackLinkReducer = linkSlice.reducer

export {recentAccountReducer, backtrackLinkReducer}