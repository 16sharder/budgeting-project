// The Register New Transfer Page:
// Shown when the user has pressed the Bank Transfer button on the Accounts page
// Displays a form for the user to fill in all the data of their transfer
// Sends the user back to the Accounts Page

import React, { useEffect } from 'react';
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import { convertTodayToDate } from '../../helperfuncs/DateCalculators';
import { findCurrency } from '../../helperfuncs/OtherCalcs';
import { addTransfer } from '../../helperfuncs/TransferFunctions';

import BorderDecorations, {BorderDecorationsBottom} from '../../components/Styling/BorderDecoration';
import { AccountSelector, AmountEntry, RateEntry, DateEntry, DescriptionEntry } from '../../components/Forms/Inputs';

function Transfer() {
    const history = useHistory()
    const location = useLocation()

    const {curUser, currency: curRency, accounts} = location.state

    const today = convertTodayToDate()

    const [account, setAccount] = useState(accounts[0].account)
    const [account2, setAccount2] = useState(accounts[1].account)
    const [currency, setCurrency] = useState(accounts[0].currency)
    const [amount, setAmount] = useState(0)
    const [currencySymbol, setSymbol] = useState(accounts[0].currency)
    const [fee, setFee] = useState(0)
    const [exchangeRate, setExchangeRate] = useState(1)
    const [date, setDate] = useState(today)
    const [description, setDescription] = useState("")


    const performTransfer = async () => {
        // retrieves the second account to get the currency
        const account2Res = await fetch(`/accounts/${account2}`)
        const account2Data = await account2Res.json()

        // adds the transfer to mongoDB
        const newTransfer = {account, account2, currency, currency2: account2Data[0].currency, amount, fee, exchangeRate, date, month: date.slice(5, 7), description}
        const res = await addTransfer(newTransfer)

        if (res) history.push({pathname:"/accounts-view", state: {user: curUser, currency: curRency}})
    }

    useEffect(() => {
        const curr = findCurrency(account, accounts)
        setCurrency(curr[0])
        setSymbol(curr[1])
    }, [account])

    return (
        <>
            <BorderDecorations />
            <div className='holder'>
            <h3>Bank Transfer</h3>
            <div></div>

            <table className='form'><tbody>
                <AccountSelector data={[account, setAccount, accounts, "Transfer From:"]}/>
                <AccountSelector data={[account2, setAccount2, accounts, "Transfer To:"]}/>
                <AmountEntry data={[currencySymbol, amount, setAmount, "Amount:"]}/>
                <AmountEntry data={[currencySymbol, fee, setFee, "Fee:"]}/>
                <RateEntry data={[exchangeRate, setExchangeRate]}/>
                <DateEntry data={[date, setDate]}/>
                <DescriptionEntry data={[description, setDescription]}/>
            </tbody></table>



            <table className='twoButtons'><tbody><tr>
                <td><button onClick={() => history.push({pathname:"/accounts-view", state: {user: curUser, currency: curRency}})}>Back</button></td>
                <td><button onClick={performTransfer}>Transfer</button></td>
            </tr></tbody></table>
            </div>
            <BorderDecorationsBottom />
        </>
    )
}

export default Transfer
