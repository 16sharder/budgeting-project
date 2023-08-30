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

import BasicBorders, {BorderFlourish} from '../../components/Styling/BorderDecoration';
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
    const [amount, setAmount] = useState()
    const [date, setDate] = useState(convertTodayToDate())
    const [description, setDescription] = useState("")

    // event listener for when user presses Enter
    const input = document.getElementById("input")

    const checkKey = (key, children) => {
        if (key == "Enter") {
            newEntry({account: children[0].children[2].children[0].value, category, 
                currency: findCurrency(children[0].children[2].children[0].value, accounts)[0], 
                amount: children[1].children[2].children[0].value *= -1, 
                date: children[2].children[2].children[0].value, 
                description: children[3].children[2].children[0].value})} 
    }


    const newEntry = async (entry) => {
        // adds the entry to mongoDB
        entry.month = date.slice(5, 7)
        const res = await addEntry(entry)

        // returns the user to the main page
        if (res) history.push({pathname:"/main", state: {user: curUser, currency: curRency, lastUsed: account}})
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
        <div>

            <h3>Add earnings</h3>
            <div></div>

            <table className='form'><tbody id="input">
                <AccountSelector data={[account, setAccount, accounts, "Bank Account:"]}/>
                <AmountEntry data={[currencySymbol, amount, setAmount, "Amount:"]}/>
                <DateEntry data={[date, setDate]}/>
                <DescriptionEntry data={[description, setDescription]}/>
            </tbody></table>



            <table className='twoButtons'><tbody><tr>
                <td><button onClick={() => history.push({pathname:"/main", state: {user: curUser, currency: curRency, lastUsed}})}>Back</button></td>
                <td><button onClick={() => newEntry({account, category, currency, amount: amount * -1, date, description})}>Add</button></td>
            </tr></tbody></table>
        </div>
        </>
    )
}

export default AddEarning