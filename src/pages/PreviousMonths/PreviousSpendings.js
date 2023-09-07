// The Previous Months' Spending Page:
// Shown when the user selects a month and account from the ChooseMonth page
// Shows the user their data for the chosen month and account for each category, as well as weekly and monthly totals
        // uses MonthlyTable component
// Includes a display of the user's total earnings for the month
// Includes links to WeekPage2 for a given week, AddEntry, AddEarning, and EarningDetails

import React from 'react';
import MonthlyTable from "../../components/MainPage/Month/MonthlyTable";
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux'
import { toEuro, toDollar } from '../../redux/currencySlice';
import { pushLink } from '../../redux/historySlice';

import {monthName} from "../../helperfuncs/DateCalculators"

import BasicBorders, {NoBorderFlourish} from '../../components/Styling/BorderDecoration';
import Navigation from '../../components/Styling/Navigation';


function SpendingsPage () {
    // retrieves the name previously passed in the form on the ChooseMonth page
    const history = useHistory()
    const location = useLocation()
    const dispatch = useDispatch()

    const currency = useSelector(state => state.currency.value)
    const accounts = useSelector(state => state.accounts.value)

    const {month, accountName} = location.state

    const [message, setMessage] = useState("Loading...")



    // retrieves the current date so as to know which month and weeks to display
    const today = new Date
    let year = today.getFullYear()
    if (month > today.getMonth()) {year = year - 1}




    // updates the currency when button is hit
    const toggleCurrency = () => {
        if (currency === "EUR") dispatch(toDollar())
        else if (currency === "USD") dispatch(toEuro())

        history.push({pathname:"/previous-spendings", state: location.state})
        window.location.reload()
    }



    // sends the user to a page displaying the desired week's information
    const viewWeek = async dates => {
        dispatch(pushLink({link: "/previous-spendings", state: location.state}))
        history.push({pathname:"/weekly-view2", state: {dates, accountName}})
    }

    // either raises an error or sends the user to the add entry page
    const sendAddEntry = () => {
        if (accounts.length === 0) alert ("You must add a bank account before you can add a new entry. Please navigate to the accounts page.")
        else history.push({pathname:"/add-entry"})
    }



    return (
        <><div className='box'>
            <BasicBorders/>
            <NoBorderFlourish/>
            <Navigation/>
            <p></p>
            <h2>{message}</h2>
            <div>Please click on a week if you would like to see entries by day</div>
            <p></p>

            <MonthlyTable data={[new Date(year, month, 1), accountName, `${accountName} - Spendings for ${monthName(month)}`, setMessage, viewWeek]}/>
            
            <table className="twoButtons"><tbody><tr>
                <td><button onClick={toggleCurrency}>Change Currency</button></td>
                <td></td>
                <td><button onClick={sendAddEntry}>Add New Entry</button></td>
            </tr></tbody></table>

            <p></p>
        </div></>
    )
}

export default SpendingsPage