// The Edit Existing Transfer Page:
// Shown when the user has selected the Edit button on a specific transfer from the Accounts page
// Displays a form for the user to update the data for their transfer, with default vals as previous vals
        // also includes a delete button
// Sends the user back to the Accounts Page

import React, { useEffect, useState } from 'react';
import {useHistory, useLocation} from "react-router-dom"

import { findCurrency } from '../../helperfuncs/OtherCalcs';
import { deleteTransfer, updateTransfer } from '../../helperfuncs/TransferFunctions';

import BorderDecorations, {BorderDecorationsBottom} from '../../components/Styling/BorderDecoration';
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


    const editTransfer = async () => {
        // retrieves the second account to get the currency
        const account2Res = await fetch(`/accounts/${account2}`)
        const account2Data = await account2Res.json()

        // edits the entry in mongoDB
        const editedEntry = {account, account2, currency, currency2: account2Data[0].currency, amount, fee, exchangeRate, date, month: date.slice(5, 7), description}
        const res = updateTransfer(entry._id, editedEntry, entry)

        // returns the user to the view details page
        if (res) history.push({pathname:"/accounts-view", state: {user: curUser, currency: curRency}})

    }

    const deleteEntry = async () => {
        const res = deleteTransfer()

        // returns the user to the view details page
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
                <td><button onClick={editTransfer}>Confirm</button></td>
            </tr></tbody></table>
    
            <br></br>

            <button onClick={deleteEntry} className="delete">Delete</button>
            </div>
        <BorderDecorationsBottom />
        </>
    )
}

export default EditTransfer

