// The Add New Entry Page:
// Shown when the user has pressed the Add New Entry button on any monthly or weekly page
// Displays a form for the user to fill in all the data for their new entry
// Sends the user back to the MainPage

import React, { useEffect, useState } from 'react';
import {useHistory} from "react-router-dom"

import { useSelector } from 'react-redux/es/hooks/useSelector';
import { setRecent } from '../../redux/historySlice';
import { useRAccountsDispatch, reloadAccounts } from '../../helperfuncs/UpdateFunctions';

import { convertTodayToDate } from '../../helperfuncs/DateCalculators';
import { findCurrency } from '../../helperfuncs/OtherCalcs';

import BasicBorders, {BorderFlourish} from '../../components/Styling/BorderDecoration';
import { AccountSelector, AmountEntry, CategorySelector, DateEntry, DescriptionEntry } from '../../components/Forms/Inputs';
import { addEntry } from '../../helperfuncs/EntryFunctions';

function AddEntry() {
    const history = useHistory()

    const lastUsedAccount = useSelector(state => state.recentAccount.value)
    const [user, accounts, dispatch] = useRAccountsDispatch()

    const today = convertTodayToDate()

    const [account, setAccount] = useState(lastUsedAccount)
    const [category, setCategory] = useState("Groceries")
    const [currency, setCurrency] = useState(accounts[0].currency)
    const [currencySymbol, setSymbol] = useState(accounts[0].currency)
    const [amount, setAmount] = useState()
    const [date, setDate] = useState(today)
    const [description, setDescription] = useState("")

    // event listener for when user presses Enter
    const input = document.getElementById("input")

    const checkKey = (key, children) => {
        if (key == "Enter") {
            newEntry({account: children[0].children[2].children[0].value, 
                category: children[1].children[2].children[0].value, 
                currency: findCurrency(children[0].children[2].children[0].value, accounts)[0], 
                amount: children[2].children[2].children[0].value, 
                date: children[3].children[2].children[0].value, 
                description: children[4].children[2].children[0].value})} 
    }

    const newEntry = async (entry) => {
        // adds the entry to mongoDB
        const res = await addEntry(entry)

        dispatch(setRecent(account))
        await reloadAccounts(user, dispatch)

        // returns the user to the main page
        if (res) history.push({pathname:"/main"})
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
        <div  className='holder'>

            <h3>Create a new entry</h3>
            <div></div>

            <table className='form'><tbody id="input">
                <AccountSelector data={[account, setAccount, "Bank Account:"]}/>
                <CategorySelector data={[category, setCategory]}/>
                <AmountEntry data={[currencySymbol, amount, setAmount, "Amount:"]}/>
                <DateEntry data={[date, setDate]}/>
                <DescriptionEntry data={[description, setDescription]}/>
            </tbody></table>



            <table className="twoButtons"><tbody><tr>
                <td><button onClick={() => history.push({pathname:"/main"})}>Back</button></td>
                <td><button onClick={() => newEntry({account, category, currency, amount, date, description})}>Add</button></td>
            </tr></tbody></table>
        </div>
        </>
    )
}

export default AddEntry
