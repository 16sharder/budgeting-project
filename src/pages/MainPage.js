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

import { useSelector } from 'react-redux/es/hooks/useSelector';

import { monthNumString } from '../helperfuncs/DateCalculators';

import MonthlyTable from "../components/MainPage/Month/MonthlyTable";
import AveragesTable from '../components/AverageSpendings/AveragesTable';
import BasicBorders, {NoBorderFlourish} from '../components/Styling/BorderDecoration';
import Navigation from '../components/Styling/Navigation';
import NetTable from '../components/MainPage/NetTable';


function MainPage () {

    // retrieves the name previously passed in the form on the Login page
    const history = useHistory()
    const location = useLocation()

    const user = useSelector(state => state.user.value)

    let {currency, lastUsed} = location.state

    const today = new Date
    const [message, setMessage] = useState("Loading...")


    // gets all of the user's account information
    const [accounts, setAccounts] = useState([])

    const loadAccounts = async (user) => {
        // retrieves a list of the user's accounts
        const response = await fetch(`/accounts/${user}`)
        const accts = await response.json()
        setAccounts(accts)
    }

    useEffect(() => {
        loadAccounts(user)
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
        history.push({pathname:"/weekly-view", state: {dates, accounts, currency, lastUsed}})
    }

    // either raises an error or sends the user to the add entry page
    const sendAddEntry = () => {
        if (accounts.length === 0) alert ("You must add a bank account before you can add a new entry. Please navigate to the accounts page.")
        else history.push({pathname:"/add-entry", state: {currency, accounts, lastUsed}})
    }


    
    return (
        <><div className='box'>
            <BasicBorders/>
            <NoBorderFlourish/>
            <Navigation currency={currency} lastUsed={lastUsed}/>
            <p></p>
            <h2>{message}</h2>
            <div>Please click on a week if you would like to see entries by day</div>
            <p></p>

            <MonthlyTable data={[today, "All Accounts", currency, `${user}, here are your spendings for this month`, setMessage, viewWeek]}/>


            <table className="twoButtons"><tbody><tr>
                <td><button onClick={toggleCurrency}>Change Currency</button></td>
                <td></td>
                <td><button onClick={sendAddEntry}>Add New Entry</button></td>
            </tr></tbody></table>


            <NetTable data={["", "All Accounts", accounts, currency, monthNumString(today.getMonth()), today.getMonth(), today.getFullYear(), lastUsed]}/>



            <br></br>

            <h3>Monthly Spendings:</h3>

            <AveragesTable currency={currency}/>

            <p></p>
            <br/>
        </div></>
    )
}

export default MainPage
