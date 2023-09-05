// The Add New Earnings Page:
// Shown when the user has pressed the Add New Earnings button on any monthly page
// Displays a form for the user to fill in all the data for their new earnings entry
// Sends the user back to the MainPage

import React, { useEffect } from 'react';
import {useState} from "react"
import {useHistory} from "react-router-dom"

import { useSelector } from 'react-redux/es/hooks/useSelector';
import { setRecent } from '../../redux/historySlice';
import { reloadAccounts, useRAccountsDispatch } from '../../helperfuncs/UpdateFunctions';

import { convertTodayToDate } from '../../helperfuncs/DateCalculators';
import { findCurrency } from '../../helperfuncs/OtherCalcs';
import { addEntry } from '../../helperfuncs/EntryFunctions';

import BasicBorders, {BorderFlourish} from '../../components/Styling/BorderDecoration';
import { AccountSelector, AmountEntry, DateEntry, DescriptionEntry } from '../../components/Forms/Inputs';

function AddEarning() {
    const history = useHistory()

    const lastUsedAccount = useSelector(state => state.recentAccount.value)
    const [user, accounts, dispatch] = useRAccountsDispatch()

    const [account, setAccount] = useState(lastUsedAccount)
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
        <div>

            <h3>Add earnings</h3>
            <div></div>

            <table className='form'><tbody id="input">
                <AccountSelector data={[account, setAccount, "Bank Account:"]}/>
                <AmountEntry data={[currencySymbol, amount, setAmount, "Amount:"]}/>
                <DateEntry data={[date, setDate]}/>
                <DescriptionEntry data={[description, setDescription]}/>
            </tbody></table>



            <table className='twoButtons'><tbody><tr>
                <td><button onClick={() => history.push({pathname:"/main"})}>Back</button></td>
                <td><button onClick={() => newEntry({account, category, currency, amount: amount * -1, date, description})}>Add</button></td>
            </tr></tbody></table>
        </div>
        </>
    )
}

export default AddEarning