import React from 'react';
import WeeklyTable from "../components/WeeklyTable";
import {useState, useEffect} from "react"
import {useHistory, useLocation} from "react-router-dom"

import {calcWeekDates} from "../helperfuncs/DateCalculators"
import {organizeDaysEntries, retrieveWeekEntries} from "../helperfuncs/FetchFunctions"
import {calculateWeekTotals} from "../helperfuncs/OtherCalcs"

import Navigation from '../components/Navigation';
import { BorderDecorationsH } from '../components/BorderDecoration';



function WeekPage2 () {
    
    // retrieves the dates previously passed in the by clicking on the Main page table
    const location = useLocation()
    const user = location.state.user
    const accounts = location.state.accounts
    const dates = location.state.dates
    let currency = location.state.currency
    const month = location.state.month
    const history = useHistory()
    const accountName = location.state.accountName

    const [message, setMessage] = useState("Loading...")


    // sends the user to a page displaying the desired entry's information
    const viewDetails = async (date, category) => {
        history.push({pathname:"/view-details", state: {user: user, date: date, weekDates: dates, category: category, currency: currency, accounts: accounts, month: month, accountName: accountName}})
    }
    

    // retrieves the information for the week to be displayed
    const [week, setWeek] = useState([])

    const loadWeek = async () => {
        const weekDates = calcWeekDates(dates)
        const entries = await retrieveWeekEntries(dates, user, 7, accountName)
        let organizedDays = []
        for (let idx in weekDates){
            const day = await organizeDaysEntries(entries[idx], currency)
            day[0] = weekDates[idx]
            organizedDays.push(day)
        }
        setMessage(`Spendings for the week of ${dates}`)
        setWeek(organizedDays)
    }

    useEffect(() => {
        loadWeek()
    }, [])

    let totalsArray = calculateWeekTotals(week)


    const toggleCurrency = () => {
        if (currency === "€") currency = "$"
        else if (currency === "$") currency = "€"

        history.push({pathname:"/weekly-view2", state: {dates: dates, user: user, currency: currency, month: month, accountName: accountName}})
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
                <td className="button"><button onClick={() => history.push({pathname:"/previous-spendings", state: {user: user, currency: currency, month: month, accountName: accountName}})} className='button'>Return to monthly view</button></td>
            </tr></tbody></table>

            <p></p>
            <div className='container bottomSep'></div>
        </>
    )
}

export default WeekPage2