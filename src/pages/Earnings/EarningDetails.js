// The View Earning Details Page:
// Shown when the user has pressed the View Earnings Details button on any monthly page
// Shows a list of earnings for that month and all of their details
// Sends the user back to the monthly page it came from

import React from 'react';
import {useState, useEffect} from "react"
import {useHistory, useLocation} from "react-router-dom"

import { useSelector } from 'react-redux/es/hooks/useSelector';

import {retrieveEarnings} from "../../helperfuncs/FetchFunctions"
import { monthName } from '../../helperfuncs/DateCalculators';

import Navigation from '../../components/Styling/Navigation';
import BasicBorders, {NoBorderFlourish} from '../../components/Styling/BorderDecoration';
import { FiEdit } from 'react-icons/fi';

function Earnings () {
    const history = useHistory()
    const location = useLocation()

    const user = useSelector(state => state.user.value)

    const {month, currency, account, accounts, lastUsed} = location.state

    const [entries, setEntries] = useState([])
    const [total, setTotal] = useState(0)

    const loadEarnings = async () => {
        const result = await retrieveEarnings(month, user, account)
        let resultCopy = result.slice()

        setEntries(resultCopy)

        let t = 0
        for (const entry of resultCopy) {
            t += entry.amount * -1
        }
        setTotal(t)
    }

    useEffect(() => {
        loadEarnings()
    }, [])


    return (
        <><div className='box'>
            <BasicBorders/>
            <NoBorderFlourish/>
            <Navigation currency={currency} />
            <p></p>

            <h2>Earnings in {monthName(Number(month) -1)} - {account}</h2>
            <div>Total: {total.toLocaleString('en', {style: "currency", currency: currency})}</div>
            <br/>
            
            <div>
                {entries.map((entry, index) => 
                    <table key={index} className='singleColumn'>
                        <thead><tr className='toprow'><th>Entry {index+1}
                            <FiEdit className="edit" onClick={() => {history.push({pathname:"/edit-earning", state: {entry: entry, currency: currency, accounts: accounts, month: month}})}}/></th></tr></thead>
                        <tbody><tr><td className='color1'><div>Account: {entry.account}</div><div>Amount: {(entry.amount*-1).toLocaleString('en', {style: "currency", currency: entry.currency})}</div><div>Description: {entry.description}</div><div></div></td></tr></tbody>
                    </table>
                )}
            </div>

            <br></br>

            <table className="twoButtons"><tbody><tr>
                <td><button onClick={() => history.push({pathname:"/add-earning", state: {currency, accounts, lastUsed}})}>
                    Add New Earnings</button></td>
                <td><button onClick={() => history.push({pathname:"/previous-month", state: {currency, month: month - 1, lastUsed}})}>
                    Return to {monthName(Number(month) -1)} Finances</button></td>
            </tr></tbody></table>
            
            <p></p>
        </div></>
    )
}

export default Earnings