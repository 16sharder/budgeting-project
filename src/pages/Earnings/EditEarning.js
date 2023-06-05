// The Edit Existing Earning Page:
// Shown when the user has selected the Edit button on a specific earning from the ViewDetails page
// Displays a form for the user to update the data for their earning entry, with default vals as previous vals
        // also includes a delete button
// Sends the user back to the MainPage

import React from 'react';
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import BorderDecorations, {BorderDecorationsBottom} from '../../components/Styling/BorderDecoration';
import { updateAccount, updateMonths } from '../../helperfuncs/UpdateFunctions';

function EditEarning() {
    const history = useHistory()
    const location = useLocation()
    const entry = location.state.entry
    const curUser = location.state.curUser
    const curRency = location.state.currency

    const accounts = location.state.accounts
    const month = location.state.month

    const [account, setAccount] = useState(entry.account)
    const [currency, setCurrency] = useState(entry.currency)
    const [amount, setAmount] = useState(-entry.amount)
    const [date, setDate] = useState(entry.date)
    const [description, setDescription] = useState(entry.description)

    // stores old values
    const oldAcct = entry.account
    const oldAmt = entry.amount
    const oldDate = entry.date


    const updateEntry = async (amount) => {
        amount *= -1
        // edits the entry in mongoDB
        const editedEntry = {account, category: "Earnings", currency, amount, date, description}
        const response = await fetch(`/entries/${entry._id}`, {
            method: "PUT", 
            body: JSON.stringify(editedEntry),
            headers: {"Content-type": "application/json"}
        })
        if (response.status !== 200){
            alert(`Edit entry failed. Status code = ${response.status}`)
        } else {

        // subtracts the old entry data from the month's records
        await updateMonths(oldDate, oldAcct, -oldAmt, "Earnings")
        // adds the new entry data to the month's records
        await updateMonths(date, account, amount, "Earnings")

        // updates the original account that was spent from
        await updateAccount(oldAcct, -oldAmt)
        // updates the actual account that was spent from
        await updateAccount(account, amount)


        // returns the user to the view details page
        history.push({pathname:"/main", state: {user: curUser, currency: curRency}})

    }}

    const deleteEntry = async () => {
        // deletes the entry from mongoDB
        const response = await fetch(`/entries/${entry._id}`, {method: "DELETE"})
        if (response.status !== 204){
            alert(`Delete entry failed. Status code = ${response.status}`)
        } else {

        // subtracts the old entry data from the month's records
        await updateMonths(oldDate, oldAcct, -oldAmt, "Earnings")
        // updates the original account that was spent from
        await updateAccount(oldAcct, -oldAmt)


        // returns the user to the view details page
        history.push({pathname:"/main", state: {user: curUser, currency: curRency}})
    }}


    return (
        <>
            <BorderDecorations />
        <div className='holder'>

            <h3>Edit entry</h3>
            <div></div>

            <table className='form'><tbody>
                <tr>
                    <td>Bank Account:</td>
                    <td></td>
                    <td><select
                        value={account}
                        onChange={newN => setAccount(newN.target.value)} >
                            {accounts.map((account, index) => <option value={account.account} key={index}>{account.account}</option>)}
                    </select></td>
                </tr>
                <tr>
                    <td>Amount:</td>
                    <td className='right'><select
                        className='currency'
                        value={currency}
                        onChange={newN => setCurrency(newN.target.value)} >
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
                <td><button onClick={() => history.push({pathname:"/main", state: {user: curUser, currency: curRency}})}>Back</button></td>
                <td><button onClick={() => updateEntry(amount)}>Confirm</button></td>
            </tr></tbody></table>
    
            <br></br>

            <button onClick={deleteEntry} className="delete">Delete</button>
            </div>
        <BorderDecorationsBottom />
        </>
    )
}

export default EditEarning
