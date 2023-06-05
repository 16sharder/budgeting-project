// The Add New Earnings Page:
// Shown when the user has pressed the Add New Earnings button on any monthly page
// Displays a form for the user to fill in all the data for their new earnings entry
// Sends the user back to the MainPage

import React from 'react';
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import { convertTodayToDate } from '../../helperfuncs/DateCalculators';
import BorderDecorations, {BorderDecorationsBottom} from '../../components/Styling/BorderDecoration';
import { updateAccount, updateMonths } from '../../helperfuncs/UpdateFunctions';

function AddEarning() {
    const history = useHistory()
    const location = useLocation()
    const curUser = location.state.user
    const curRency = location.state.currency
    const accounts = location.state.accounts

    const today = convertTodayToDate()

    const [account, setAccount] = useState(`${accounts[0].account}`)
    const category = "Earnings"
    const [currency, setCurrency] = useState(`${accounts[0].currency}`)
    const [amount, setAmount] = useState(0)
    const [date, setDate] = useState(today)
    const [description, setDescription] = useState("")

    const addEntry = async (amount) => {
        // adds the entry to mongoDB
        const month = date.slice(5, 7)
        amount *= -1
        const newEntry = {account, category, currency, amount, date, month, description}
        const response = await fetch("/entries", {
            method: "POST", 
            body: JSON.stringify(newEntry),
            headers: {"Content-type": "application/json"}
        })
        if (response.status !== 201){
            alert(`Add earnings failed. Status code = ${response.status}`)
        } else {

        // adds the entry to the month's records
        updateMonths(date, account, amount, category)
        // updates the account that gained earnings
        updateAccount(account, amount)


        // returns the user to the main page
        history.push({pathname:"/main", state: {user: curUser, currency: curRency}})

    }}


    return (
        <>
            <BorderDecorations />
        <div>

            <h3>Add earnings</h3>
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



            <table className='twoButtons'><tbody><tr>
                <td><button onClick={() => history.push({pathname:"/main", state: {user: curUser, currency: curRency}})}>Back</button></td>
                <td><button onClick={() => addEntry(amount)}>Add</button></td>
            </tr></tbody></table>
        </div>
        <BorderDecorationsBottom />
        </>
    )
}

export default AddEarning