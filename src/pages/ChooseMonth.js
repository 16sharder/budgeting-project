import React, { useEffect } from 'react';
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import BorderDecorations, {BorderDecorationsBottom} from '../components/BorderDecoration';
import { retrieveUserAccountNames } from '../helperfuncs/FetchFunctions';
import { monthName } from '../helperfuncs/DateCalculators';

function ChooseMonth () {
    const location = useLocation()
    const user = location.state.user
    let currency = location.state.currency

    const [accounts, setAccounts] = useState([])
    const getAccounts = async (user) => {
        const accounts = await retrieveUserAccountNames(user)
        setAccounts(accounts)
    }

    let [account, setAccount] = useState("all")

    const today = new Date

    const [month, setMonth] = useState(today.getMonth())

    const history = useHistory()

    const send = () => {
        history.push({pathname:"/previous-spendings", state: {user: user, currency: currency, month: month, accountName: account}})
    }

    // loads everything
    useEffect(() => {
        getAccounts(user)
    }, [])


    // sets the months to be displayed in the selection
    const month0 = today.getMonth()

    let month1 = month0 - 1
    if (month0 == 0){month1 = 11}

    let month2 = month1 - 1
    if (month1 == 0){month2 = 11}

    let month3 = month2 - 1
    if (month2 == 0){month3 = 11}

    let month4 = month3 - 1
    if (month3 == 0){month4 = 11}

    let month5 = month4 - 1
    if (month4 == 0){month5 = 11}

    let month6 = month5 - 1
    if (month5 == 0){month6 = 11}

    let month7 = month6 - 1
    if (month6 == 0){month7 = 11}

    let month8 = month7 - 1
    if (month7 == 0){month8 = 11}

    let month9 = month8 - 1
    if (month8 == 0){month9 = 11}

    let month10 = month9 - 1
    if (month9 == 0){month10 = 11}

    let month11 = month10 - 1
    if (month10 == 0){month11 = 11}



    return (
        <>
            <BorderDecorations />
            <h3>Please choose an account and a month to view</h3>


            <table><tbody><tr>
            <td className='invisBackground'><select
                value={account}
                onChange={newN => setAccount(newN.target.value)} >
                    <option value="all">All accounts</option>
                    {accounts.map((account, index) => <option value={account} key={index}>{account}</option>)}
            </select></td>
            <td className='invisBackground'></td>
            <td className='invisBackground'><select
                value={month}
                onChange={newN => {setMonth(newN.target.value)}}>
                    <option value={month0}>{monthName(month0)}</option>
                    <option value={month1}>{monthName(month1)}</option>
                    <option value={month2}>{monthName(month2)}</option>
                    <option value={month3}>{monthName(month3)}</option>
                    <option value={month4}>{monthName(month4)}</option>
                    <option value={month5}>{monthName(month5)}</option>
                    <option value={month6}>{monthName(month6)}</option>
                    <option value={month7}>{monthName(month7)}</option>
                    <option value={month8}>{monthName(month8)}</option>
                    <option value={month9}>{monthName(month9)}</option>
                    <option value={month10}>{monthName(month10)}</option>
                    <option value={month11}>{monthName(month11)}</option>
            </select></td>
            </tr></tbody></table>

            <p></p>
            <button className="button" onClick={send}>Continue</button>
            <BorderDecorationsBottom />
        </>
    )
}

export default ChooseMonth