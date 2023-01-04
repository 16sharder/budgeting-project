import React from 'react';
import WeeklyTable from "../components/WeeklyTable";
import {useState, useEffect} from "react"
import {useHistory, useLocation} from "react-router-dom"

import {calcWeekDates} from "../helperfuncs/DateCalculators"
import {organizeDaysEntries, retrieveWeekEntries} from "../helperfuncs/FetchFunctions"
import {calculateWeekTotals} from "../helperfuncs/OtherCalcs"

import Navigation from '../components/Navigation';
import { BorderDecorationsH } from '../components/BorderDecoration';



function WeekPage () {
    
    // retrieves the dates previously passed in the by clicking on the Main page table
    const location = useLocation()
    const user = location.state.user
    const accounts = location.state.accounts
    const dates = location.state.dates
    let currency = location.state.currency
    const history = useHistory()

    const [message, setMessage] = useState("Loading...")


    // sends the user to a page displaying the desired entry's information
    const viewDetails = async (date, category) => {
        history.push({pathname:"/view-details", state: {user: user, date: date, weekDates: dates, category: category, currency: currency, accounts: accounts}})
    }
    

    // retrieves the information for the week to be displayed
    const [week, setWeek] = useState([])

    const loadWeek = async () => {
        const weekDates = calcWeekDates(dates)
        const entries = await retrieveWeekEntries(dates, user)
        let organizedDays = []
        for (let idx in weekDates){
            const day = await organizeDaysEntries(entries[idx], currency)
            day[0] = weekDates[idx]
            organizedDays.push(day)
        }
        setMessage(`${user}, here are your spendings for the week of ${dates}`)
        setWeek(organizedDays)
    }

    useEffect(() => {
        loadWeek()
    }, [])

    let totalsArray = calculateWeekTotals(week)


    const toggleCurrency = () => {
        if (currency === "€") currency = "$"
        else if (currency === "$") currency = "€"

        history.push({pathname:"/weekly-view", state: {dates: dates, user: user, currency: currency}})
        window.location.reload()
    }
    

    return (
        <>
            <BorderDecorationsH />
            <Navigation user={user} currency={currency} />
            <p></p>
            <h2>{message}</h2>
            <div>Please click on an entry if you would like to see more details</div>
            <p></p>

            <WeeklyTable week={week} viewDetails={viewDetails} total={totalsArray} currency={currency}/>
            <table><tbody><tr>
                <td className="button"><button onClick={toggleCurrency} className="currency">Change currency</button></td>
                <td className="button"><button onClick={() => history.push({pathname:"/add-entry", state: {curUser: user, currency: currency, accounts: accounts}})} className="button">Add new entry</button></td>
            </tr></tbody></table>

            <button onClick={() => history.push({pathname:"/main", state: {user: user, currency: currency}})}>Return to monthly view</button>
            <p></p>
            <div className='container bottomSep'></div>
        </>
    )
}

export default WeekPage
