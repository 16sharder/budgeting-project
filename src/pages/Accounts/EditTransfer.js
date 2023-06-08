// The Edit Existing Transfer Page:
// Shown when the user has selected the Edit button on a specific transfer from the Accounts page
// Displays a form for the user to update the data for their transfer, with default vals as previous vals
        // also includes a delete button
// Sends the user back to the Accounts Page

import React, { useEffect } from 'react';
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import BorderDecorations, {BorderDecorationsBottom} from '../../components/Styling/BorderDecoration';
import { updateAccount, updateMonths } from '../../helperfuncs/UpdateFunctions';
import { AccountSelector, AmountEntry, RateEntry, DateEntry, DescriptionEntry } from '../../components/Forms/Inputs';

function EditTransfer() {
    const history = useHistory()
    const location = useLocation()

    const {entry, curUser, currency: curRency, accounts} = location.state

    const [account, setAccount] = useState(entry.account)
    const [account2, setAccount2] = useState(entry.account2)
    const [currency, setCurrency] = useState(entry.currency)
    const [amount, setAmount] = useState(entry.amount)
    const [fee, setFee] = useState(entry.fee)
    const [currencySymbol, setSymbol] = useState(entry.currency)
    const [exchangeRate, setExchangeRate] = useState(entry.exchangeRate)
    const [date, setDate] = useState(entry.date)
    const [description, setDescription] = useState(entry.description)

    // stores old values
    const {account: oldAcct, account2: oldAcct2, amount: oldAmt, date: oldDate, fee: oldFee, exchangeRate: oldRate} = entry


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

            <h3>Edit transfer</h3>
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

