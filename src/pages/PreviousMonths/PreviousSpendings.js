// The Previous Months' Spending Page:
// Shown when the user selects a month and account from the ChooseMonth page
// Shows the user their data for the chosen month and account for each category, as well as weekly and monthly totals
        // uses MonthlyTable component
// Includes a display of the user's total earnings for the month
// Includes links to WeekPage2 for a given week, AddEntry, AddEarning, and EarningDetails

import React from 'react';
import MonthlyTable from "../../components/MainPage/Month/MonthlyTable";
import {useState, useEffect} from "react"
import {useHistory, useLocation} from "react-router-dom"

import {createMonthDates, monthName} from "../../helperfuncs/DateCalculators"
import {organizeDaysEntries, retrieveWeekEntries, retrieveEarnings, convertToEuros, convertToDollars, retrieveMonth} from "../../helperfuncs/FetchFunctions"
import {calculateWeekTotals} from "../../helperfuncs/OtherCalcs"

import { BorderDecorationsH } from '../../components/Styling/BorderDecoration';
import Navigation from '../../components/Styling/Navigation';


function SpendingsPage () {

    // retrieves the name previously passed in the form on the ChooseMonth page
    const location = useLocation()
    const user = location.state.user
    let currency = location.state.currency
    const month = location.state.month
    const history = useHistory()
    const accountName = location.state.accountName

    let monthNumStr = String(Number(month) + 1)
    if (monthNumStr.length == 1) monthNumStr = `0${monthNumStr}`

    const [message, setMessage] = useState("Loading...")


    // sends the user to a page displaying the desired week's information
    const viewWeek = async dates => {
        history.push({pathname:"/weekly-view2", state: {dates: dates, user: user, accounts: accounts, currency: currency, month: month, accountName: accountName}})
    }





    // retrieves the current date so as to know which month and weeks to display
    const today = new Date
    let year = today.getFullYear()
    if (month > today.getMonth()) {year = year - 1}

    const date = new Date(year, month, 1)
    const monthDatesArray = createMonthDates(date)


    // retrieves the information for the month to be displayed
    const [monthArray, setMonth] = useState([])

    const loadMonth = async () => {
        let monthArray = []
        for (let week of monthDatesArray) {
            // gets an array (7) of days, each day containing each entry for that day
            const days = await retrieveWeekEntries(week, user, 7, accountName)
            let organizedDays = []
            for (let day of days){
                // sums the entries for each category for the day, returning an array of category sums
                const organized = await organizeDaysEntries(day, currency)
                organizedDays.push(organized)
            }
            // sums the entries for the week for each category
            let organizedWeek = calculateWeekTotals(organizedDays)
            organizedWeek[0] = week
            // adds each week's array of sums to an array for the month
            monthArray.push(organizedWeek)
        }
        setMessage(`${accountName} - Spendings for ${monthName(month)}`)
        setMonth(monthArray)
    }

    // sums the entries for the month for each category
    const [totalsArray, setTotals] = useState(calculateWeekTotals(monthNumStr))

    const loadTotals = async () => {
        let totals = await retrieveMonth(Number(month)+1, user, accountName)
        if (totals != undefined) setTotals(totals)
    }



    // gets all of the users account information, for use in passing on to next pages
    const [accounts, setAccounts] = useState([])

    const loadAccounts = async (user) => {
        const response = await fetch(`/accounts/${user}`)
        const data = await response.json()
        setAccounts(data)
    }


    // loads everything
    useEffect(() => {
        loadMonth()
        loadAccounts(user)
        loadEarnings()
        loadTotals()
    }, [])





    // updates the currency when button is hit
    const toggleCurrency = () => {
        if (currency === "€") currency = "$"
        else if (currency === "$") currency = "€"

        history.push({pathname:"/previous-spendings", state: {user: user, currency: currency, month: month, accountName: accountName}})
        window.location.reload()
    }



    // retrieves the persons earnings for the month
    const [earnings, setEarnings] = useState(0)

    const loadEarnings = async () => {

        const earnings = await retrieveEarnings(monthNumStr, user, accountName)

        let totalEarnings = 0
        for (let earning of earnings){
            let value = earning.amount
            // determines if the entry needs to be converted to a different currency for display
            if (currency === "€") {
                if (earning.currency != currency) value = await convertToEuros(earning.amount)
            } 
            else if (currency === "$") {
                if (earning.currency != currency) value = await convertToDollars(earning.amount)
            } 
            totalEarnings -= value
        }

        setEarnings(totalEarnings)
    }

    // either raises an error or sends the user to the add entry page
    const sendAddEntry = () => {
        if (accounts.length === 0) alert ("You must add a bank account before you can add a new entry. Please navigate to the accounts page.")
        else history.push({pathname:"/add-entry", state: {curUser: user, currency: currency, accounts: accounts}})
    }



    return (
        <>
            <BorderDecorationsH />
            <Navigation user={user} currency={currency} />
            <p></p>
            <h2>{message}</h2>

            <MonthlyTable month={monthArray} viewWeek={viewWeek} total={totalsArray} currency={currency}/>
            <table className="twoButtons"><tbody><tr>
                <td><button onClick={toggleCurrency}>Change Currency</button></td>
                <td></td>
                <td><button onClick={sendAddEntry}>Add New Entry</button></td>
            </tr></tbody></table>


            <table className='netTable'><tbody><tr>
                <td><h2>Earnings: {currency}{earnings.toFixed(2)}</h2>
                    <button onClick={() => history.push({pathname:"/add-earning", state: {user: user, currency: currency, accounts: accounts}})}>Add New Earnings</button>
                <br></br><button onClick={ () => history.push({pathname:"/earnings", state: {month: monthNumStr, user: user, currency: currency, account: accountName}})}>View Earnings Details</button>
                </td>
                <td></td>
                <td><h2>Net Gain/Loss: {currency}{(earnings-totalsArray[11]).toFixed(2)}</h2><br></br><br></br><br></br><br></br><br></br>
                </td>

            </tr></tbody></table>

            <p></p>
            <div className='container bottomSep'></div>
        </>
    )
}

export default SpendingsPage