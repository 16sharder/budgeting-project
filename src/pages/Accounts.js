import React from 'react';
import {useState, useEffect} from "react"
import {useHistory, useLocation} from "react-router-dom"

import { retrieveUserAccountNames, retrieveWeekEntries } from '../helperfuncs/FetchFunctions';
import {calcMonthEnd, monthName} from "../helperfuncs/DateCalculators"
import {calculateNetWorth} from "../helperfuncs/OtherCalcs"

import Navigation from '../components/Navigation';
import { BorderDecorationsH } from '../components/BorderDecoration';

function Accounts() {
    const location = useLocation()
    const user = location.state.user
    let currency = location.state.currency
    
    // gets all of the users account information
    const [accounts, setAccounts] = useState([])

    const loadAccounts = async (user) => {
        const response = await fetch(`/accounts/${user}`)
        const data = await response.json()
        setAccounts(data)
    }


    const history = useHistory()

    const today = new Date()


    // code to display accounts at beginning of month
    const month = today.getMonth()
    const year = today.getFullYear()

    const [months, setMonths] = useState([])

    // retrieves the months data
    const fetchMonth = async () => {
        const response = await fetch(`/months/${month}`)
        const data = await response.json()
        setMonths (data)
    }

    const beginnings = []

    // makes sure that only the month for the right year and right account is added, for each account
    for (const account of accounts) {
        let thisMonth = undefined
        for (const mo of months){
            if (mo.year == year) {
                if (mo.account == account.account){
                    thisMonth = mo
                }
            }
        }

        // adds the amount spent to the current amount in bank, to get amount at beginning of month
        let spent = 0
        if (thisMonth != undefined) {spent = thisMonth.monthlyTotal}
        beginnings.push((account.amount + spent).toFixed(2))
    }







    // retrieves user's net worth 
    const [netWorth, setNetWorth] = useState(0)

    const loadNetWorth = async () => {
        const result = await calculateNetWorth(user, currency)
        setNetWorth(result)
    }




    // loads all of the transfers from the current and previous months
    const [transfers, setTransfers] = useState([])

    const loadTransfers = async () => {
        const fetchTransfers = async (month) => {
            const response = await fetch(`/transfers/${month}`)
            const data = await response.json()
            return data
        }
    
        const curMonth = await fetchTransfers(today.getMonth()+1)
        const preMonth = await fetchTransfers(today.getMonth())
    
        const accountNames = await retrieveUserAccountNames(user)

        const transferList = []
        for (const transfer of curMonth) {
            if (accountNames.includes(transfer.account)) {
                transferList.push(transfer)
            }
        }
    
        for (const transfer of preMonth) {
            if (accountNames.includes(transfer.account)) {
                transferList.push(transfer)
            }
        }
    
        setTransfers(transferList)
    }
    
    
    const changeDate = (date) => {
        let dateCopy = date.slice(5, date.length)
        const dashIndex = dateCopy.indexOf("-")
        dateCopy = `${dateCopy.slice(0, dashIndex)}/${dateCopy.slice(dashIndex+1, dateCopy.length)}`

        if (dateCopy[dashIndex+1] == 0) dateCopy = `${dateCopy.slice(0, dashIndex+1)}${dateCopy.slice(dashIndex+2, dateCopy.length)}`
        if (dateCopy[0] == 0) dateCopy = dateCopy.slice(1, dateCopy.length)

        return dateCopy
    }








    useEffect(() => {
        loadNetWorth()
        loadAccounts(user)
        loadTransfers()
        fetchMonth()
    }, [])




    const sendTransfer = () => {
        if (accounts.length < 2) alert ("You must have at least two bank accounts before you can perform a transfer")
        else history.push({pathname:"/transfer", state: {curUser: user, currency: currency, accounts: accounts}})
    }


    return (
        <>
            <BorderDecorationsH />
            <Navigation user={user} currency={currency} />
            <p></p>
            <h2>Accounts Overview</h2>

            <table>
                <thead>
                    <tr>
                        <th className="toprow color2 acct"><div>Accounts on</div> {monthName(today.getMonth())} First</th>
                        <th className="toprow acct"></th>
                        <th className="toprow color2 acct">Accounts Now</th>
                    </tr>
                </thead>
                <tbody>
                {accounts.map((account, index) => <tr key={index} className='color5'>
                    <td className="color1">{account.currency}{beginnings[index]}</td>
                    <td className="bold">{account.account}</td>
                    <td className='color1'>{account.currency}{account.amount.toFixed(2)}</td></tr>)}
                </tbody>
            </table>

            
            <table><tbody><tr>
                <td className="button"><button onClick={sendTransfer} className="currency">Bank Transfer</button></td>
                <td className="button"><button onClick={() => history.push({pathname:"/add-account", state: {curUser: user, currency: currency}})} className="button">Add new account</button></td>
            </tr></tbody></table>
            
            <h3>Total Net Worth</h3>
            <div className='color5'>{currency}{netWorth}</div>



            <p></p>
            <h3>Recent Transfers</h3>

            <table>
                <thead>
                    <tr>
                        <th className="toprow color2">From</th>
                        <th className="toprow color2">To</th>
                        <th className="toprow color2">Amount Given</th>
                        <th className="toprow color2">Amount Received</th>
                        <th className="toprow color2">Date</th>
                        <th className="toprow color2">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {transfers.map((transfer, index) => <tr key={index}>
                        <td className="bold color5">{transfer.account}</td>
                        <td className='bold color5'>{transfer.account2}</td>
                        <td className="color1">{transfer.currency}{transfer.amount}</td>
                        <td className='color1'>{transfer.currency2}{transfer.amount * transfer.exchangeRate}</td>
                        <td>{changeDate(transfer.date)}</td>
                        <td>{transfer.description}</td>
                    </tr>)}
                </tbody>
            </table>


            <p></p>
            <div className='container bottomSep'></div>
        </>
    )
}

export default Accounts