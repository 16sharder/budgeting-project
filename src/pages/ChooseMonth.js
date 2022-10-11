import React, { useEffect } from 'react';
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import BorderDecorations, {BorderDecorationsBottom} from '../components/BorderDecoration';
import { retrieveUserAccountNames } from '../helperfuncs/FetchFunctions';

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
                    <option value={0}>January</option>
                    <option value={1}>February</option>
                    <option value={2}>March</option>
                    <option value={3}>April</option>
                    <option value={4}>May</option>
                    <option value={5}>June</option>
                    <option value={6}>July</option>
                    <option value={7}>August</option>
                    <option value={8}>September</option>
                    <option value={9}>October</option>
                    <option value={10}>November</option>
                    <option value={11}>December</option>
            </select></td>
            </tr></tbody></table>

            <p></p>
            <button className="button" onClick={send}>Continue</button>
            <BorderDecorationsBottom />
        </>
    )
}

export default ChooseMonth