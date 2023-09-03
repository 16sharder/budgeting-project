// The Register New Transfer Page:
// Shown when the user has pressed the Bank Transfer button on the Accounts page
// Displays a form for the user to fill in all the data of their transfer
// Sends the user back to the Accounts Page

import React, { useEffect } from 'react';
import {useState} from "react"
import {useHistory} from "react-router-dom"

import { useSelector } from 'react-redux/es/hooks/useSelector';

import { convertTodayToDate } from '../../helperfuncs/DateCalculators';
import { findCurrency } from '../../helperfuncs/OtherCalcs';
import { addTransfer } from '../../helperfuncs/TransferFunctions';

import BasicBorders, {BorderFlourish} from '../../components/Styling/BorderDecoration';
import { AccountSelector, AmountEntry, RateEntry, DateEntry, DescriptionEntry } from '../../components/Forms/Inputs';

function Transfer() {
    const history = useHistory()

    const accounts = useSelector(state => state.accounts.value)

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


    // event listener for when user presses Enter
    const input = document.getElementById("input")

    const checkKey = (key, children) => {
        if (key == "Enter") {
            performTransfer({account: children[0].children[2].children[0].value, 
                account2: children[1].children[2].children[0].value, 
                currency: findCurrency(children[0].children[2].children[0].value, accounts)[0], 
                amount: children[2].children[2].children[0].value, 
                fee: children[3].children[2].children[0].value, 
                exchangeRate: children[4].children[2].children[0].value,
                date: children[5].children[2].children[0].value, 
                description: children[6].children[2].children[0].value})} 
    }
    

    const performTransfer = async (newTransfer) => {
        // retrieves the second account to get the currency
        const account2Res = await fetch(`/accounts/${newTransfer.account2}`)
        const account2Data = await account2Res.json()

        // adds the transfer to mongoDB
        newTransfer.currency2 = account2Data[0].currency
        newTransfer.month = date.slice(5, 7)
        const res = await addTransfer(newTransfer)

        if (res) history.push({pathname:"/accounts-view"})
    }

    useEffect(() => {
        const curr = findCurrency(account, accounts)
        setCurrency(curr[0])
        setSymbol(curr[1])
    }, [account])


    useEffect(() => {
        if (input != undefined) {
            const children = input.children
            input.addEventListener("keypress", (key) => checkKey(key.key, children))
            return () => input.removeEventListener("keypress", (key) => checkKey(key, children))
        }
    }, [input])

    return (
        <>
            <BasicBorders/>
            <BorderFlourish/>
            <div className='holder'>
            <h3>Bank Transfer</h3>
            <div></div>

            <table className='form'><tbody id="input">
                <AccountSelector data={[account, setAccount, "Transfer From:"]}/>
                <AccountSelector data={[account2, setAccount2, "Transfer To:"]}/>
                <AmountEntry data={[currencySymbol, amount, setAmount, "Amount:"]}/>
                <AmountEntry data={[currencySymbol, fee, setFee, "Fee:"]}/>
                <RateEntry data={[exchangeRate, setExchangeRate]}/>
                <DateEntry data={[date, setDate]}/>
                <DescriptionEntry data={[description, setDescription]}/>
            </tbody></table>



            <table className='twoButtons'><tbody><tr>
                <td><button onClick={() => history.push({pathname:"/accounts-view"})}>Back</button></td>
                <td><button onClick={() => performTransfer({account, account2, currency, amount, fee, exchangeRate, date, description})}>Transfer</button></td>
            </tr></tbody></table>
            </div>
        </>
    )
}

export default Transfer
