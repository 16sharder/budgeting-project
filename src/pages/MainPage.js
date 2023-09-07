// The Main Page:
// Shown when the user has entered their name on the LoginPage, or when they select Home in the navigation bar
// Shows the user their data for this month for each category, as well as weekly and monthly totals
        // uses MonthlyTable component
// Includes a display of the user's total earnings for the month
// Also shows a table of the user's average spendings for the past 6 months
        // uses AveragesTable component
// Includes links to WeekPage for a given week, AddEntry, AddEarning, and EarningDetails

import React from 'react';
import {useState} from "react"
import {useHistory} from "react-router-dom"

import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux'
import { toEuro, toDollar } from '../redux/currencySlice';
import { pushLink } from '../redux/historySlice';

import { monthNumString } from '../helperfuncs/DateCalculators';

import MonthlyTable from "../components/MainPage/Month/MonthlyTable";
import AveragesTable from '../components/AverageSpendings/AveragesTable';
import BasicBorders, {NoBorderFlourish} from '../components/Styling/BorderDecoration';
import Navigation from '../components/Styling/Navigation';
import NetTable from '../components/MainPage/NetTable';


function MainPage () {
    const history = useHistory()
    const dispatch = useDispatch()

    const user = useSelector(state => state.user.value)
    const currency = useSelector(state => state.currency.value)
    const accounts = useSelector(state => state.accounts.value)

    const today = new Date
    const [message, setMessage] = useState("Loading...")



    // updates the currency when button is hit
    const toggleCurrency = () => {
        if (currency === "EUR") dispatch(toDollar())
        else if (currency === "USD") dispatch(toEuro())

        history.push({pathname:"/main"})
        window.location.reload()
    }



    // sends the user to a page displaying the desired week's information
    const viewWeek = async dates => {
        enableBackButton()
        history.push({pathname:"/weekly-view", state: {dates}})
    }

    // either raises an error or sends the user to the add entry page
    const sendAddEntry = () => {
        if (accounts.length === 0) alert ("You must add a bank account before you can add a new entry. Please navigate to the accounts page.")
        else {
            enableBackButton()
            history.push({pathname:"/add-entry"})
        }
    }

    const enableBackButton = () => dispatch(pushLink({link: "/main", state: {}}))
    
    return (
        <><div className='box'>
            <BasicBorders/>
            <NoBorderFlourish/>
            <Navigation/>
            <p></p>
            <h2>{message}</h2>
            <div>Please click on a week if you would like to see entries by day</div>
            <p></p>

            <MonthlyTable data={[today, "All Accounts", `${user}, here are your spendings for this month`, setMessage, viewWeek]}/>


            <table className="twoButtons"><tbody><tr>
                <td><button onClick={toggleCurrency}>Change Currency</button></td>
                <td></td>
                <td><button onClick={sendAddEntry}>Add New Entry</button></td>
            </tr></tbody></table>


            <NetTable data={["", "All Accounts", monthNumString(today.getMonth()), today.getMonth(), today.getFullYear(), enableBackButton]}/>



            <br></br>

            <h3>Monthly Spendings:</h3>

            <AveragesTable/>

            <p></p>
            <br/>
        </div></>
    )
}

export default MainPage
