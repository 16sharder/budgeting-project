// The Week Page:
// Shown when the user clicks View Week button on the MainPage
// Shows the user their data from a specific week for each category, as well as daily and weekly totals
        // uses WeeklyTable component
// Includes links to ViewDetails for a given day + category, AddEntry and MainPage

import React from 'react';
import WeeklyTable from "../components/MainPage/Week/WeeklyTable";
import {useState, useEffect} from "react"
import {useHistory, useLocation} from "react-router-dom"

import { useSelector } from 'react-redux/es/hooks/useSelector';

import {calcWeekDates} from "../helperfuncs/DateCalculators"
import {organizeDaysEntries, retrieveWeekEntries} from "../helperfuncs/FetchFunctions"
import {calculateWeekTotals} from "../helperfuncs/OtherCalcs"

import Navigation from '../components/Styling/Navigation';
import BasicBorders, {NoBorderFlourish} from '../components/Styling/BorderDecoration';



function WeekPage () {
    
    // retrieves the dates previously passed in the by clicking on the Main page table
    const history = useHistory()
    const location = useLocation()

    const user = useSelector(state => state.user.value)

    const {accounts, dates, lastUsed} = location.state
    let {currency} = location.state

    const [message, setMessage] = useState("Loading...")


    // sends the user to a page displaying the desired entry's information
    const viewDetails = async (date, category) => {
        history.push({pathname:"/view-details", state: {date, weekDates: dates, category, currency, accounts}})
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
        if (currency === "EUR") location.state.currency = "USD"
        else if (currency === "USD") location.state.currency = "EUR"

        history.push({pathname:"/weekly-view", state: location.state})
        window.location.reload()
    }
    

    return (
        <><div className='box'>
            <BasicBorders/>
            <NoBorderFlourish/>
            <Navigation currency={currency} lastUsed={lastUsed}/>
            <p></p>
            <h2>{message}</h2>
            <div>Please click on an entry if you would like to see more details</div>
            <p></p>

            <WeeklyTable week={week} viewDetails={viewDetails} total={totalsArray} currency={currency}/>
            <table className="twoButtons"><tbody><tr>
                <td><button onClick={toggleCurrency}>Change Currency</button></td>
                <td></td>
                <td><button onClick={() => history.push({pathname:"/add-entry", state: {currency, accounts, lastUsed}})}>Add New Entry</button></td>
            </tr></tbody></table>

            <button onClick={() => history.push({pathname:"/main", state: {currency, lastUsed}})}>Return to monthly view</button>
            <p></p>
        </div></>
    )
}

export default WeekPage
