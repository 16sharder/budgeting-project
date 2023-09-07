import { useDispatch, useSelector } from "react-redux"
import { setAccounts } from "../redux/accountsSlice"
import { popLink } from "../redux/historySlice"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

// for use in conjunction with reloadAccounts, is a react hook
function useRAccountsDispatch() {
    const user = useSelector(state => state.user.value)
    const accounts = useSelector(state => state.accounts.value)
    const dispatch = useDispatch()

    return [user, accounts, dispatch]
}

// after any change in the accounts, is called to reset the accounts state var
async function reloadAccounts(user, dispatch) {
    const response = await fetch(`/accounts/${user}`)
    const accounts = await response.json()
    
    dispatch(setAccounts(accounts))
}

function useReduxHistory() {
    const history = useHistory()
    const dispatch = useDispatch()

    let linksArray = useSelector(state => state.backtrackLink.value)
    let argsArray = useSelector(state => state.backtrackLink.args)

    return [history, dispatch, linksArray, argsArray]
}

function backbutton(vars, int = 1)  {
    const [history, dispatch, linksArray, argsArray] = vars
    console.log(vars)

    for (let i = 0; i < int; i++) dispatch(popLink())

    const link = linksArray[linksArray.length - int]
    const args = argsArray[argsArray.length - int]
    
    history.push({pathname: link, state: args})
}

export {useRAccountsDispatch, reloadAccounts, useReduxHistory, backbutton}