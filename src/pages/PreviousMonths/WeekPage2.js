// The Second Week Page:
// Shown when the user clicks View Week button on the PreviousSpendings Page
// Shows the user their data from a specific week for each category, as well as daily and weekly totals
        // uses WeeklyTable component
// Includes links to ViewDetails for a given day + category, and back to that month's Previous Spendings

import React from 'react';
import WeeklyTable from "../../components/MainPage/Week/WeeklyTable";
import {useState, useEffect} from "react"
import {useHistory, useLocation} from "react-router-dom"

import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux'
import { toEuro, toDollar } from '../../redux/currencySlice';
import { pushLink } from '../../redux/historySlice';
import { backbutton, useReduxHistory } from '../../helperfuncs/ReduxFunctions';

import {calcWeekDates} from "../../helperfuncs/DateCalculators"
import {organizeDaysEntries, retrieveWeekEntries} from "../../helperfuncs/FetchFunctions"
import {calculateWeekTotals} from "../../helperfuncs/OtherCalcs"

import Navigation from '../../components/Styling/Navigation';
import BasicBorders, {NoBorderFlourish} from '../../components/Styling/BorderDecoration';



function WeekPage2 () {
    
    // retrieves the dates previously passed in the by clicking on the Main page table
    const history = useHistory()
    const location = useLocation()
    const dispatch = useDispatch()

    const user = useSelector(state => state.user.value)
    const currency = useSelector(state => state.currency.value)
    
    const {accountName, dates} = location.state

    const [message, setMessage] = useState("Loading...")


    // sends the user to a page displaying the desired entry's information
    const viewDetails = async (date, category) => {
        dispatch(pushLink({link: "/weekly-view2", state: location.state}))
        history.push({pathname:"/view-details", state: {date, category}})
    }
    

    // retrieves the information for the week to be displayed
    const [week, setWeek] = useState([])

    const loadWeek = async () => {
        const weekDates = calcWeekDates(dates)
        const entries = await retrieveWeekEntries(dates, user, accountName, 7)
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
        if (currency === "EUR") dispatch(toDollar())
        else if (currency === "USD") dispatch(toEuro())

        history.push({pathname:"/weekly-view2", state: location.state})
        window.location.reload()
    }

    const buttonArgs = useReduxHistory()

    const goBack = () => {
        backbutton(buttonArgs)
    }
    

    return (
        <><div className='box'>
            <BasicBorders/>
            <NoBorderFlourish/>
            <Navigation/>
            <p></p>
            <h2>{message}</h2>
            <div>Please click on an entry if you would like to see more details</div>
            <p></p>

            <WeeklyTable week={week} viewDetails={viewDetails} total={totalsArray} currency={currency}/>
            <table className="twoButtons"><tbody><tr>
                <td><button onClick={toggleCurrency}>Change Currency</button></td>
                <td></td>
                <td><button onClick={goBack}>Return to monthly view</button></td>
            </tr></tbody></table>

            <p></p>
        </div></>
    )
}

export default WeekPage2