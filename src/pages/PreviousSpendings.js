import React from 'react';
import MonthlyTable from "../components/MonthlyTable";
import {useState, useEffect} from "react"
import {useHistory, useLocation} from "react-router-dom"

import {createMonthDates, monthName} from "../helperfuncs/DateCalculators"
import {organizeDaysEntries, retrieveWeekEntries, retrieveEarnings, convertToEuros, convertToDollars} from "../helperfuncs/FetchFunctions"
import {calculateWeekTotals} from "../helperfuncs/OtherCalcs"

import { BorderDecorationsH } from '../components/BorderDecoration';
import Navigation from '../components/Navigation';


function SpendingsPage () {

    // retrieves the name previously passed in the form on the ChooseMonth page
    const location = useLocation()
    const user = location.state.user
    let currency = location.state.currency
    const month = location.state.month
    const history = useHistory()
    const accountName = location.state.accountName



    // sends the user to a page displaying the desired week's information
    const viewWeek = async dates => {
        history.push({pathname:"/weekly-view2", state: {dates: dates, user: user, accounts: accounts, currency: currency, month: month, accountName: accountName}})
    }





    // retrieves the current date so as to know which month and weeks to display
    const date = new Date(2022, month, 1)
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
        setMonth(monthArray)
    }

    // sums the entries for the month for each category
    let totalsArray = calculateWeekTotals(monthArray)



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

    let monthNumStr = String(Number(month) + 1)
    if (monthNumStr.length == 1) monthNumStr = `0${monthNumStr}`

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



    return (
        <>
            <BorderDecorationsH />
            <Navigation user={user} currency={currency} />
            <p></p>
            <h2>Spendings for {monthName(month)}</h2>

            <MonthlyTable month={monthArray} viewWeek={viewWeek} total={totalsArray} currency={currency}/>
            <table><tbody><tr>
                <td className="button"><button onClick={toggleCurrency} className="currency">Change currency</button></td>
                <td className="button"><button className="button invisible"></button></td>
            </tr></tbody></table>


            <h3>Earnings: {currency}{earnings.toFixed(2)}</h3>

            <button onClick={ () => history.push({pathname:"/earnings", state: {month: monthNumStr, user: user, currency: currency, accounts: accounts}})}>View Earnings Details</button>

            <p></p>
            <div className='container bottomSep'></div>
        </>
    )
}

export default SpendingsPage