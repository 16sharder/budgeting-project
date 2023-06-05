// The Edit Existing Transfer Page:
// Shown when the user has selected the Edit button on a specific transfer from the Accounts page
// Displays a form for the user to update the data for their transfer, with default vals as previous vals
        // also includes a delete button
// Sends the user back to the Accounts Page

import React from 'react';
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import BorderDecorations, {BorderDecorationsBottom} from '../../components/Styling/BorderDecoration';
import { updateAccount, updateMonths } from '../../helperfuncs/UpdateFunctions';

function getFeeCurrency(currency){
    if (currency == "USD") return "$"
    else if (currency == "EUR") return "€"
}

function EditTransfer() {
    const history = useHistory()
    const location = useLocation()
    const entry = location.state.entry
    const curUser = location.state.curUser
    const curRency = location.state.currency

    const accounts = location.state.accounts
    const month = location.state.month

    const [account, setAccount] = useState(entry.account)
    const [account2, setAccount2] = useState(entry.account2)
    const [currency, setCurrency] = useState(entry.currency)
    const [amount, setAmount] = useState(entry.amount)
    const [fee, setFee] = useState(entry.fee)
    const [fee_currency, setFeeCurr] = useState(getFeeCurrency(entry.currency))
    const [exchangeRate, setExchangeRate] = useState(entry.exchangeRate)
    const [date, setDate] = useState(entry.date)
    const [description, setDescription] = useState(entry.description)

    // stores old values
    const oldAcct = entry.account
    const oldAcct2 = entry.account2
    const oldAmt = entry.amount
    const oldDate = entry.date
    const oldFee = entry.fee
    const oldRate = entry.exchangeRate


    const updateEntry = async (amount) => {
        // retrieves the second account to get the currency
        const account2Res = await fetch(`/accounts/${account2}`)
        const account2Data = await account2Res.json()

        const currency2 = account2Data[0].currency

        // edits the entry in mongoDB
        const month = date.slice(5, 7)
        const editedEntry = {account, account2, currency, currency2, amount, fee, exchangeRate, date, month, description}
        const response = await fetch(`/transfers/${entry._id}`, {
            method: "PUT", 
            body: JSON.stringify(editedEntry),
            headers: {"Content-type": "application/json"}
        })
        if (response.status !== 200){
            alert(`Edit entry failed. Status code = ${response.status}`)
        } else {

        // removes the transfer from the month's records for both old accounts
        await updateMonths(oldDate, oldAcct, (oldAmt + oldFee) * -1)
        await updateMonths(oldDate, oldAcct2, oldAmt * oldRate)

        // adds the transfer to the month's records for both new accounts
        await updateMonths(date, account, Number(amount) + Number(fee))
        await updateMonths(date, account2, amount * exchangeRate * -1)

        // updates both old accounts
        await updateAccount(oldAcct, (oldAmt + oldFee) * -1)
        await updateAccount(oldAcct2, oldAmt * oldRate)

        // updates both new accounts
        await updateAccount(account, Number(amount) + Number(fee))
        await updateAccount(account2, amount * exchangeRate * -1)

        // returns the user to the view details page
        history.push({pathname:"/accounts-view", state: {user: curUser, currency: curRency}})

    }}

    const deleteEntry = async () => {
        // deletes the entry from mongoDB
        const response = await fetch(`/transfers/${entry._id}`, {method: "DELETE"})
        if (response.status !== 204){
            alert(`Delete entry failed. Status code = ${response.status}`)
        } else {

        // removes the transfer from the month's records for both old accounts
        await updateMonths(oldDate, oldAcct, (oldAmt + oldFee) * -1)
        await updateMonths(oldDate, oldAcct2, oldAmt * oldRate)

        // updates both old accounts
        await updateAccount(oldAcct, (oldAmt + oldFee) * -1)
        await updateAccount(oldAcct2, oldAmt * oldRate)


        // returns the user to the view details page
        history.push({pathname:"/accounts-view", state: {user: curUser, currency: curRency}})
    }}

    const setCurrencies = (currency) => {
        setCurrency(currency)
        setFeeCurr(getFeeCurrency(currency))
    }


    return (
        <>
            <BorderDecorations />
            <div className='holder'>

            <h3>Edit transfer</h3>
            <div></div>

            <table className='form'><tbody>
                <tr>
                    <td>Transfer From:</td>
                    <td></td>
                    <td><select
                        value={account}
                        onChange={newN => setAccount(newN.target.value)} >
                            {accounts.map((account, index) => <option value={account.account} key={index}>{account.account}</option>)}
                    </select></td>
                </tr>
                <tr>
                    <td>Transfer To:</td>
                    <td></td>
                    <td><select
                        value={account2}
                        onChange={newN => setAccount2(newN.target.value)} >
                            {accounts.map((account, index) => <option value={account.account} key={index}>{account.account}</option>)}
                    </select></td>
                </tr>
                <tr>
                    <td>Amount:</td>
                    <td className='right'><select
                        className='currency'
                        value={currency}
                        onChange={newN => setCurrencies(newN.target.value)} >
                            <option value="EUR">€</option>
                            <option value="USD">$</option>
                        </select></td>
                    <td>
                        <input 
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={newN => setAmount(newN.target.value)} />
                    </td>
                </tr>
                <tr>
                    <td>Fee:</td>
                    <td className='right color1'>{fee_currency}</td>
                    <td>
                        <input 
                            type="number"
                            placeholder="0.00"
                            value={fee}
                            onChange={newN => setFee(newN.target.value)} />
                    </td>
                </tr>
                <tr>
                    <td>Exchange Rate:</td>
                    <td></td>
                    <td>
                        <input 
                            type="number"
                            placeholder="1"
                            value={exchangeRate}
                            onChange={newN => setExchangeRate(newN.target.value)} />
                    </td>
                </tr>
                <tr>
                    <td>Date:</td>
                    <td></td>
                    <td>
                        <input 
                            type="date"
                            placeholder="mm/dd"
                            value={date}
                            onChange={newN => setDate(newN.target.value)} />
                    </td>
                </tr>
                <tr>
                    <td> Descripton:</td>
                    <td></td>
                    <td>
                        <input 
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={newN => setDescription(newN.target.value)} />
                    </td>
                </tr>
            </tbody></table>



            <table className="twoButtons"><tbody><tr>
                <td><button onClick={() => history.push({pathname:"/accounts-view", state: {user: curUser, currency: curRency}})}>Back</button></td>
                <td><button onClick={() => updateEntry(amount)}>Confirm</button></td>
            </tr></tbody></table>
    
            <br></br>

            <button onClick={deleteEntry} className="delete">Delete</button>
            </div>
        <BorderDecorationsBottom />
        </>
    )
}

export default EditTransfer

