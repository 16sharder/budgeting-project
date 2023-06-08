// The Register New Transfer Page:
// Shown when the user has pressed the Bank Transfer button on the Accounts page
// Displays a form for the user to fill in all the data of their transfer
// Sends the user back to the Accounts Page

import React, { useEffect } from 'react';
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import { convertTodayToDate } from '../../helperfuncs/DateCalculators';
import BorderDecorations, {BorderDecorationsBottom} from '../../components/Styling/BorderDecoration';
import { updateAccount, updateMonths } from '../../helperfuncs/UpdateFunctions';
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

        const currency2 = account2Data[0].currency

        // adds the transfer to mongoDB
        const month = date.slice(5, 7)
        const newTransfer = {account, account2, currency, currency2, amount, fee, exchangeRate, date, month, description}
        const response = await fetch("/transfers", {
            method: "POST", 
            body: JSON.stringify(newTransfer),
            headers: {"Content-type": "application/json"}
        })
        if (response.status === 201){
            alert("Successfully performed transfer")
        
        // adds the transfer to the month's records for both accounts
        await updateMonths(date, account, Number(amount) + Number(fee))
        await updateMonths(date, account2, amount * exchangeRate * -1)
        // updates both accounts
        await updateAccount(account, Number(amount) + Number(fee))
        await updateAccount(account2, amount * exchangeRate * -1)



        history.push({pathname:"/accounts-view", state: {user: curUser, currency: curRency}})

        }else{
            alert(`Transfer failed. Status code = ${response.status}`)
        }
        
    }

    useEffect(() => {
        let curr;
        for (const acct of accounts){
            if (acct.account == account) {
                curr = acct.currency
                break
            }
        }
        setCurrency(curr)
        
        const ext = Number(0).toLocaleString("en", {style: "currency", currency: curr})
        setSymbol(ext[0])
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
