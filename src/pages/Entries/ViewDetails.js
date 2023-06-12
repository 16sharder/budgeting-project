// The View Entry Details Page:
// Shown when the user selects a specific day and category on the WeekPage or WeekPage2
// Shows a list of entries and all of their details with an edit button
// Includes links to the weekly page it came from, or the monthly page for that date

import React from 'react';
import {useState, useEffect} from "react"
import {useHistory, useLocation} from "react-router-dom"

import {retrieveDayEntries} from "../../helperfuncs/FetchFunctions"

import Navigation from '../../components/Styling/Navigation';
import BasicBorders, {NoBorderFlourish} from '../../components/Styling/BorderDecoration';

import { FiEdit } from "react-icons/fi";

function ViewDetails () {
    const history = useHistory()
    const location = useLocation()

    const {user, date, weekDates, category, currency, month, accounts} = location.state
    let {accountName} = location.state
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
        if (month == undefined) history.push({pathname:"/main", state: {user, currency}})
        else history.push({pathname:"/previous-spendings", state: {user, currency, month, accountName}})
    }

    const sendWeek = () => {
        if (month == undefined) history.push({pathname:"/weekly-view", state: {user, dates: weekDates, currency, accounts}})
        else history.push({pathname:"/weekly-view2", state: {user, dates: weekDates, currency, month, accountName}})
    }

    return (
        <><div className='box'>
            <BasicBorders/>
            <NoBorderFlourish/>
            <Navigation user={user} currency={currency} />
            <p></p>
            <h2>{category} entries for {date}</h2>
            <div>
                {entries.map((entry, index) => 
                    <table key={index} className='singleColumn'>
                        <thead><tr className='toprow'><th>Entry {index+1}
                            <FiEdit className="edit" onClick={() => {history.push({pathname:"/edit", state: {entry, curUser: user, currency, accounts, dates: weekDates, month}})}}/></th></tr></thead>
                        <tbody><tr><td className='color1'><div>Account: {entry.account}</div><div>Amount: {entry.amount.toLocaleString('en', {style: "currency", currency: entry.currency})}</div><div>Description: {entry.description}</div><div></div></td></tr></tbody>
                    </table>
                )}

            <table className='twoButtons'><tbody><tr>
                <td><button onClick={sendWeek}>Return to weekly view</button></td>
                <td><button onClick={sendMonth}>Return to monthly view</button></td>
            </tr></tbody></table>

            </div>
            
            <p></p>
        </div></>
    )
}

export default ViewDetails
