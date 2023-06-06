// The Add New Entry Page:
// Shown when the user has pressed the Add New Entry button on any monthly or weekly page
// Displays a form for the user to fill in all the data for their new entry
// Sends the user back to the MainPage

import React, { useEffect } from 'react';
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import { convertTodayToDate } from '../../helperfuncs/DateCalculators';
import BorderDecorations, {BorderDecorationsBottom} from '../../components/Styling/BorderDecoration';
import { updateAccount, updateMonths } from '../../helperfuncs/UpdateFunctions';

function AddEntry() {
    const history = useHistory()
    const location = useLocation()
    const curUser = location.state.curUser
    const curRency = location.state.currency
    const accounts = location.state.accounts
    
    let lastUsed = location.state.lastUsed
    if (lastUsed == undefined) lastUsed = accounts[0].account

    const today = convertTodayToDate()

    const [account, setAccount] = useState(lastUsed)
    const [category, setCategory] = useState("Groceries")
    const [currency, setCurrency] = useState(accounts[0].currency)
    const [currencySymbol, setSymbol] = useState(accounts[0].currency)
    const [amount, setAmount] = useState(0)
    const [date, setDate] = useState(today)
    const [description, setDescription] = useState("")

    const addEntry = async () => {
        // adds the entry to mongoDB
        const newEntry = {account, category, currency, amount, date, description}
        const response = await fetch("/entries", {
            method: "POST", 
            body: JSON.stringify(newEntry),
            headers: {"Content-type": "application/json"}
        })
        if (response.status !== 201){
            alert(`Create entry failed. Status code = ${response.status}`)
        } else {

        // adds the entry to the month's records
        updateMonths(date, account, amount, category)
        // updates the account that was spent from
        updateAccount(account, amount)


        // returns the user to the main page
        history.push({pathname:"/main", state: {user: curUser, currency: curRency, lastUsed: account}})

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


    const catsArray = ["Groceries", "Eating Out", "Clothing", "House Supplies", "Work Supplies", "Travel", "Bills", "Cash", "Emergencies", "Other"]


    return (
        <>
            <BorderDecorations />
        <div  className='holder'>

            <h3>Create a new entry</h3>
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
                    <td>Category:</td>
                    <td></td>
                    <td><select
                        value={category}
                        onChange={newN => setCategory(newN.target.value)} >
                            {catsArray.map((cat, index) => 
                            <option value={cat} key={index}>{cat}</option>)}
                    </select></td>
                </tr>
                <tr>
                    <td>Amount:</td>
                    <td className='right color1'>{currencySymbol}</td>
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
                    <td>Descripton:</td>
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
                <td><button onClick={() => history.push({pathname:"/main", state: {user: curUser, currency: curRency, lastUsed: lastUsed}})}>Back</button></td>
                <td><button onClick={addEntry}>Add</button></td>
            </tr></tbody></table>
        </div>
        <BorderDecorationsBottom />
        </>
    )
}

export default AddEntry
