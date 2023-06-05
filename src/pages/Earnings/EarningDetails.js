// The View Earning Details Page:
// Shown when the user has pressed the View Earnings Details button on any monthly page
// Shows a list of earnings for that month and all of their details
// Sends the user back to the monthly page it came from

import React from 'react';
import {useState, useEffect} from "react"
import {useHistory, useLocation} from "react-router-dom"

import {retrieveEarnings} from "../../helperfuncs/FetchFunctions"
import { monthName } from '../../helperfuncs/DateCalculators';

import Navigation from '../../components/Styling/Navigation';
import {BorderDecorationsH} from '../../components/Styling/BorderDecoration';
import { FiEdit } from 'react-icons/fi';

function Earnings () {
    const location = useLocation()
    const user = location.state.user
    const month = location.state.month
    const currency = location.state.currency
    const account = location.state.account
    const history = useHistory()
    const accounts = location.state.accounts

    const [entries, setEntries] = useState([])


    const loadEarnings = async () => {
        const result = await retrieveEarnings(month, user, account)
        let resultCopy = result.slice()

        setEntries(resultCopy)
    }

    useEffect(() => {
        loadEarnings()
    }, [])


    const sendMonth = () => {
        if (month == undefined) history.push({pathname:"/main", state: {user: user, currency: currency}})
        else history.push({pathname:"/previous-spendings", state: {user: user, currency: currency, month: month - 1, accountName: account}})
    }

    return (
        <>
            <div className='fillerBottom'></div>
            <BorderDecorationsH />
            <Navigation user={user} currency={currency} />
            <p></p>
            <h2>Earnings in {monthName(Number(month) -1)}</h2>
            <div>
                {entries.map((entry, index) => 
                    <table key={index} className='singleColumn'>
                        <thead><tr className='toprow'><th>Entry {index+1}
                            <FiEdit className="edit" onClick={() => {history.push({pathname:"/edit-earning", state: {entry: entry, curUser: user, currency: currency, accounts: accounts, month: month}})}}/></th></tr></thead>
                        <tbody><tr><td className='color1'><div>Account: {entry.account}</div><div>Amount: {(entry.amount*-1).toLocaleString('en', {style: "currency", currency: entry.currency})}</div><div>Description: {entry.description}</div><div></div></td></tr></tbody>
                    </table>
                )}
            </div>

            <br></br>

            <button onClick={sendMonth}>Return to monthly view</button>
            
            <p></p>
            <div className='container bottomFix'></div>
        </>
    )
}

export default Earnings