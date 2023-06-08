// The Add New Earnings Page:
// Shown when the user has pressed the Add New Earnings button on any monthly page
// Displays a form for the user to fill in all the data for their new earnings entry
// Sends the user back to the MainPage

import React, { useEffect } from 'react';
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import { convertTodayToDate } from '../../helperfuncs/DateCalculators';
import { findCurrency } from '../../helperfuncs/OtherCalcs';
import { addEntry } from '../../helperfuncs/EntryFunctions';

import BorderDecorations, {BorderDecorationsBottom} from '../../components/Styling/BorderDecoration';
import { AccountSelector, AmountEntry, DateEntry, DescriptionEntry } from '../../components/Forms/Inputs';

function AddEarning() {
    const history = useHistory()
    const location = useLocation()


    const {curUser, currency: curRency, accounts} = location.state
    let {lastUsed} = location.state
    if (lastUsed == undefined) lastUsed = accounts[0].account

    const [account, setAccount] = useState(lastUsed)
    const category = "Earnings"
    const [currency, setCurrency] = useState(accounts[0].currency)
    const [currencySymbol, setSymbol] = useState(accounts[0].currency)
    const [amount, setAmount] = useState(0)
    const [date, setDate] = useState(convertTodayToDate())
    const [description, setDescription] = useState("")

    const newEntry = async () => {
        // adds the entry to mongoDB
        const entry = {account, category, currency, amount: amount * -1, date, month: date.slice(5, 7), description}
        await addEntry(entry)

        // returns the user to the main page
        history.push({pathname:"/main", state: {user: curUser, currency: curRency, lastUsed: account}})
    }


    useEffect(() => {
        const curr = findCurrency(account, accounts)
        setCurrency(curr[0])
        setSymbol(curr[1])
    }, [account])


    return (
        <>
            <BorderDecorations />
        <div>

            <h3>Add earnings</h3>
            <div></div>

            <table className='form'><tbody>
                <AccountSelector data={[account, setAccount, accounts, "Bank Account:"]}/>
                <AmountEntry data={[currencySymbol, amount, setAmount, "Amount:"]}/>
                <DateEntry data={[date, setDate]}/>
                <DescriptionEntry data={[description, setDescription]}/>
            </tbody></table>



            <table className='twoButtons'><tbody><tr>
                <td><button onClick={() => history.push({pathname:"/main", state: {user: curUser, currency: curRency, lastUsed}})}>Back</button></td>
                <td><button onClick={newEntry}>Add</button></td>
            </tr></tbody></table>
        </div>
        <BorderDecorationsBottom />
        </>
    )
}

export default AddEarning