// The Add New Entry Page:
// Shown when the user has pressed the Add New Entry button on any monthly or weekly page
// Displays a form for the user to fill in all the data for their new entry
// Sends the user back to the MainPage

import React, { useEffect, useState } from 'react';
import {useHistory, useLocation} from "react-router-dom"

import { convertTodayToDate } from '../../helperfuncs/DateCalculators';
import { findCurrency } from '../../helperfuncs/OtherCalcs';

import BasicBorders, {BorderFlourish} from '../../components/Styling/BorderDecoration';
import { AccountSelector, AmountEntry, CategorySelector, DateEntry, DescriptionEntry } from '../../components/Forms/Inputs';
import { addEntry } from '../../helperfuncs/EntryFunctions';

function AddEntry() {
    const history = useHistory()
    const location = useLocation()

    const {curUser, currency: curRency, accounts} = location.state
    let {lastUsed} = location.state
    if (lastUsed == undefined) lastUsed = accounts[0].account

    const today = convertTodayToDate()

    const [account, setAccount] = useState(lastUsed)
    const [category, setCategory] = useState("Groceries")
    const [currency, setCurrency] = useState(accounts[0].currency)
    const [currencySymbol, setSymbol] = useState(accounts[0].currency)
    const [amount, setAmount] = useState(0)
    const [date, setDate] = useState(today)
    const [description, setDescription] = useState("")

    const newEntry = async () => {
        // adds the entry to mongoDB
        const entry = {account, category, currency, amount, date, description}
        const res = await addEntry(entry)

        // returns the user to the main page
        if (res) history.push({pathname:"/main", state: {user: curUser, currency: curRency, lastUsed: account}})
    }

    useEffect(() => {
        const curr = findCurrency(account, accounts)
        setCurrency(curr[0])
        setSymbol(curr[1])
    }, [account])


    return (
        <>
            <BasicBorders/>
            <BorderFlourish/>
        <div  className='holder'>

            <h3>Create a new entry</h3>
            <div></div>

            <table className='form'><tbody>
                <AccountSelector data={[account, setAccount, accounts, "Bank Account:"]}/>
                <CategorySelector data={[category, setCategory]}/>
                <AmountEntry data={[currencySymbol, amount, setAmount, "Amount:"]}/>
                <DateEntry data={[date, setDate]}/>
                <DescriptionEntry data={[description, setDescription]}/>
            </tbody></table>



            <table className="twoButtons"><tbody><tr>
                <td><button onClick={() => history.push({pathname:"/main", state: {user: curUser, currency: curRency, lastUsed}})}>Back</button></td>
                <td><button onClick={newEntry}>Add</button></td>
            </tr></tbody></table>
        </div>
        </>
    )
}

export default AddEntry
