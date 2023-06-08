// The Main Page:
// Shown when the user has entered their name on the LoginPage, or when they select Home in the navigation bar
// Shows the user their data for this month for each category, as well as weekly and monthly totals
        // uses MonthlyTable component
// Includes a display of the user's total earnings for the month
// Also shows a table of the user's average spendings for the past 6 months
        // uses AveragesTable component
// Includes links to WeekPage for a given week, AddEntry, AddEarning, and EarningDetails

import React from 'react';
import {useState, useEffect} from "react"
import {useHistory, useLocation} from "react-router-dom"

import {retrieveEarnings, convertToEuros, convertToDollars, retrieveNetSpendings} from "../helperfuncs/FetchFunctions"
import { monthNumString } from '../helperfuncs/DateCalculators';

import MonthlyTable from "../components/MainPage/Month/MonthlyTable";
import AveragesTable from '../components/AverageSpendings/AveragesTable';
import { BorderDecorationsH } from '../components/Styling/BorderDecoration';
import Navigation from '../components/Styling/Navigation';


function MainPage () {

    // retrieves the name previously passed in the form on the Login page
    const history = useHistory()
    const location = useLocation()

    const {user} = location.state
    let {currency, lastUsed} = location.state

    const today = new Date
    const [message, setMessage] = useState("Loading...")


    // gets all of the user's account information
    const [accounts, setAccounts] = useState([])
    const [netGain, setNetGain] = useState(0)

    const loadAccounts = async (user) => {
        // retrieves a list of the user's accounts
        const response = await fetch(`/accounts/${user}`)
        const accts = await response.json()
        setAccounts(accts)

        const names = accts.map((acct) => acct.account)

        let result = 0
        const allSpent = await retrieveNetSpendings(today.getMonth(), today.getFullYear(), names)
        for (const spent of allSpent){
            result += spent
        }
        setNetGain(result)
    }


    // retrieves the user's earnings for the month
    const [earnings, setEarnings] = useState(0)

    const monthNumStr = monthNumString(today.getMonth())

    const loadEarnings = async () => {

        const earnings = await retrieveEarnings(monthNumStr, user)

        let totalEarnings = 0
        for (let earning of earnings){
            let value = earning.amount
            // determines if the entry needs to be converted to a different currency for display
            if (currency === "EUR") {
                if (earning.currency != currency) value = await convertToEuros(earning.amount)
            } 
            else if (currency === "USD") {
                if (earning.currency != currency) value = await convertToDollars(earning.amount)
            } 
            totalEarnings -= value
        }

        setEarnings(totalEarnings)
    }



    // loads everything
    useEffect(() => {
        loadAccounts(user)
        loadEarnings()
    }, [])



    // updates the currency when button is hit
    const toggleCurrency = () => {
        if (currency === "EUR") location.state.currency = "USD"
        else if (currency === "USD") location.state.currency = "EUR"

        history.push({pathname:"/main", state: location.state})
        window.location.reload()
    }



    // sends the user to a page displaying the desired week's information
    const viewWeek = async dates => {
        history.push({pathname:"/weekly-view", state: {dates, user, accounts, currency, lastUsed}})
    }

    // either raises an error or sends the user to the add entry page
    const sendAddEntry = () => {
        if (accounts.length === 0) alert ("You must add a bank account before you can add a new entry. Please navigate to the accounts page.")
        else history.push({pathname:"/add-entry", state: {curUser: user, currency, accounts, lastUsed}})
    }


    
    return (
        <>
            <BorderDecorationsH />
            <Navigation user={user} currency={currency} lastUsed={lastUsed}/>
            <p></p>
            <h2>{message}</h2>
            <div>Please click on a week if you would like to see entries by day</div>
            <p></p>

            <MonthlyTable data={[today, user, "All Accounts", currency, `${user}, here are your spendings for this month`, setMessage, viewWeek]}/>


            <table className="twoButtons"><tbody><tr>
                <td><button onClick={toggleCurrency}>Change Currency</button></td>
                <td></td>
                <td><button onClick={sendAddEntry}>Add New Entry</button></td>
            </tr></tbody></table>



            <table className='netTable'><tbody><tr>
                <td><h2>Earnings: {earnings.toLocaleString('en', {style: "currency", currency: currency})}</h2>
                    <button onClick={ () => history.push({pathname:"/earnings", state: {month: monthNumStr, user, currency, account: "All Accounts", accounts, lastUsed}})}>View Earnings Details</button>
                </td>
                <td></td>
                <td><h2>Net Gain/Loss: {Number(netGain).toLocaleString('en', {style: "currency", currency: currency})}</h2><br></br><br></br><br></br><br></br><br></br>
                </td>

            </tr></tbody></table>

            <br></br>

            <h3>Monthly Spendings:</h3>

            <AveragesTable user={user} currency={currency}/>

            <p></p>
            <div className='container bottomSep'></div>
        </>
    )
}

export default MainPage
