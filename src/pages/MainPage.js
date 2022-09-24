import React from 'react';
import MonthlyTable from "../components/MonthlyTable";
import {useState, useEffect} from "react"
import {useHistory, useLocation} from "react-router-dom"

import {createMonthDates} from "../helperfuncs/DateCalculators"
import {organizeDaysEntries, retrieveWeekEntries} from "../helperfuncs/FetchFunctions"
import {calculateWeekTotals, calculateNetWorth} from "../helperfuncs/OtherCalcs"
import BorderDecorations from '../components/BorderDecoration';


function MainPage () {

    // retrieves the name previously passed in the form on the Login page
    const location = useLocation()
    const user = location.state.user
    let currency = location.state.currency
    const history = useHistory()



    // sends the user to a page displaying the desired week's information
    const viewWeek = async dates => {
        history.push({pathname:"/weekly-view", state: {dates: dates, user: user, accounts: accounts, currency: currency}})
    }





    // retrieves the current date so as to know which month and weeks to display
    const today = new Date()
    const monthDatesArray = createMonthDates(today)


    // retrieves the information for the month to be displayed
    const [month, setMonth] = useState([])

    const loadMonth = async () => {
        let monthArray = []
        for (let week of monthDatesArray) {
            // gets an array (7) of days, each day containing each entry for that day
            const days = await retrieveWeekEntries(week, user)
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
    let totalsArray = calculateWeekTotals(month)



    // gets all of the users account information
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
        loadNetWorth()
    }, [])


    // updates the currency when button is hit
    const toggleCurrency = () => {
        if (currency === "€") currency = "$"
        else if (currency === "$") currency = "€"

        history.push({pathname:"/main", state: {user: user, currency: currency}})
        window.location.reload()
    }


    // retrieves user's net worth 
    const [netWorth, setNetWorth] = useState(0)

    const loadNetWorth = async () => {
        const result = await calculateNetWorth(user, currency)
        setNetWorth(result)
    }


    const sendAddEntry = () => {
        console.log(accounts)
        if (accounts.length === 0) alert ("You must add a bank account before you can add a new entry")
        else history.push({pathname:"/add-entry", state: {curUser: user, currency: currency, accounts: accounts}})
    }


    return (
        <>
            <BorderDecorations />
            <p></p>
            <h2>{user}, here are your spendings for this month</h2>

            <MonthlyTable month={month} viewWeek={viewWeek} total={totalsArray} currency={currency}/>
            <table><tbody><tr>
                <td className="button"><button onClick={toggleCurrency} className="currency">Change currency</button></td>
                <td className="button"><button onClick={sendAddEntry} className="button">Add new entry</button></td>
            </tr></tbody></table>

            <h3>Your Accounts</h3>
            <div>
                {accounts.map((account, index) => <div key={index} className='color5'>{account.account}: {account.currency}{account.amount}</div>)}
            </div>
            <button onClick={() => history.push({pathname:"/add-account", state: {curUser: user, currency: currency}})} className="button">Add new account</button>
            <h3>Total Net Worth</h3>
            <div className='color5'>{currency}{netWorth}</div>
            <button onClick={() => history.push("/")} className="button">Log out</button>
            <p></p>
            <div className='container bottomSep'></div>
        </>
    )
}

export default MainPage
