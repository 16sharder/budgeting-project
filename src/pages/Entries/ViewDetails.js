// The View Entry Details Page:
// Shown when the user selects a specific day and category on the WeekPage or WeekPage2
// Shows a list of entries and all of their details with an edit button
// Includes links to the weekly page it came from, or the monthly page for that date

import React from 'react';
import {useState, useEffect} from "react"
import {useHistory, useLocation} from "react-router-dom"

import {retrieveDayEntries} from "../../helperfuncs/FetchFunctions"

import Navigation from '../../components/Styling/Navigation';
import {BorderDecorationsH} from '../../components/Styling/BorderDecoration';

import { FiEdit } from "react-icons/fi";

function ViewDetails () {
    const location = useLocation()
    const user = location.state.user
    const date = location.state.date
    const weekDates = location.state.weekDates
    const category = location.state.category
    const currency = location.state.currency
    const month = location.state.month
    const history = useHistory()
    const accounts = location.state.accounts
    let accountName = location.state.accountName

    if (accountName == undefined) accountName = "All Accounts"

    const [entries, setEntries] = useState([])


    const loadDay = async () => {
        const result = await retrieveDayEntries(date, user, accountName)
        let resultCopy = result.slice()
        for (let entry of result){
            if (entry.category != category) {
                resultCopy.splice(resultCopy.indexOf(entry), 1)
            }
        }
        setEntries(resultCopy)
    }

    useEffect(() => {
        loadDay()
    }, [])


    const sendMonth = () => {
        if (month == undefined) history.push({pathname:"/main", state: {user: user, currency: currency}})
        else history.push({pathname:"/previous-spendings", state: {user: user, currency: currency, month: month, accountName: accountName}})
    }

    const sendWeek = () => {
        if (month == undefined) history.push({pathname:"/weekly-view", state: {user: user, dates: weekDates, currency: currency, accounts: accounts}})
        else history.push({pathname:"/weekly-view2", state: {user: user, dates: weekDates, currency: currency, month: month, accountName: accountName}})
    }

    return (
        <>
            <div className='fillerBottom'></div>
            <BorderDecorationsH />
            <Navigation user={user} currency={currency} />
            <p></p>
            <h2>{category} entries for {date}</h2>
            <div>
                {entries.map((entry, index) => 
                    <table key={index}>
                        <thead><tr><th className='single toprow color2'>Entry {index+1}
                            <FiEdit className="edit" onClick={() => {history.push({pathname:"/edit", state: {entry: entry, curUser: user, currency: currency, accounts: accounts, dates: weekDates, month: month}})}}/></th></tr></thead>
                        <tbody><tr><td className='single color1'><div>Account: {entry.account}</div><div>Amount: {entry.currency}{entry.amount.toFixed(2)}</div><div>Description: {entry.description}</div><div></div></td></tr></tbody>
                    </table>
                )}
            </div>

            <table><tbody><tr className='invisBackground'>
                <td className='invisBackground detailsButtons'><button onClick={sendWeek} className="currency">Return to weekly view</button></td>
                <td className='invisBackground detailsButtons'><button onClick={sendMonth} className="button">Return to monthly view</button></td>
            </tr></tbody></table>
            
            <p></p>
            <div className='container bottomFix'></div>
        </>
    )
}

export default ViewDetails
