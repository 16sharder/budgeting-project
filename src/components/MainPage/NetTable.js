import React from 'react';
import {useState, useEffect} from "react"
import {useHistory} from "react-router-dom"

import { useSelector } from 'react-redux/es/hooks/useSelector';

import { convertToDollars, convertToEuros, retrieveEarnings, retrieveMonth, retrieveNetSpendings } from '../../helperfuncs/FetchFunctions';

function NetTable ({data}) {
    const user = useSelector(state => state.user.value)
    const currency = useSelector(state => state.currency.value)

    let [label, accountName, accounts, monthNumStr, month, year, lastUsed] = data

    const [spendings, setSpendings] = useState(0)
    const [earnings, setEarnings] = useState(0)
    const [tOut, setOut] = useState(0)
    const [tIn, setIn] = useState(0)
    const [net, setNet] = useState(0)
    const [netColor, setColor] = useState("")

    let names;
    const history = useHistory()

    const loadSpendings = async () => {
        let totals = await retrieveMonth(Number(month)+1, year, user, accountName)
        if (totals != undefined) {
            setSpendings(totals[12] + totals[11])
        }
    }

    // retrieves the persons earnings for the month
    const loadEarnings = async () => {

        const earnings = await retrieveEarnings(monthNumStr, user, accountName)

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

    const loadTransfers = async () => {
        const fetchTransfers = async (month) => {
            const response = await fetch(`/transfers/${month}`)
            const data = await response.json()
            return data
        }

        const allTransfers = await fetchTransfers(Number(month) + 1)

        let transfersOut = 0
        let transfersIn = 0
        
        for (const transfer of allTransfers) {
            if (Number(transfer.date.slice(0,4)) == year){
                if (names.includes(transfer.account)) {
                    transfersOut += transfer.amount + transfer.fee
                }
                if (names.includes(transfer.account2)) {
                    transfersIn += transfer.amount
                }
            }
        }

        setOut(transfersOut)
        setIn(transfersIn)
    }

    const loadNet = async () => {
        let result = 0
        const allSpent = await retrieveNetSpendings(month, year, names)
        for (const spent of allSpent){
            result += spent
        }
        setNet(result)

        if ((result) < 0) setColor("color1")
    }



    useEffect(() => {
        loadSpendings()
        loadEarnings()
    }, [])

    useEffect(() => {
        if (accountName == "All Accounts") {
            names = accounts.map((acct) => acct.account)
        }
        else names = [accountName]
        loadTransfers()
        loadNet()
    }, [accounts])





    const sendSpendings = () => {
        if (accountName != "All Accounts") lastUsed = accountName
        history.push({pathname:"/previous-spendings", state: {month, accountName, lastUsed}})
    }

    return (
        <>
            <h3>{label}</h3>
            <table>
                <thead>
                    <tr className='bold color2 horizontalB wide'>
                        <th><h3>Spendings</h3></th>
                        <th><h3>Earnings</h3></th>
                        <th><h3>Transfered Out</h3></th>
                        <th><h3>Transfered In</h3></th>
                        <th className='corner verticalB'><h3>Net Gain/Loss</h3></th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='wide'>
                        <td className='color1' onClick={sendSpendings}><h3>
                            -{spendings.toLocaleString('en', {style: "currency", currency})}
                        </h3></td>

                        <td onClick={() => history.push({pathname:"/earnings", state: {month: monthNumStr, account: accountName, accounts, lastUsed}})}><h3 >
                            {earnings.toLocaleString('en', {style: "currency", currency})}
                        </h3></td>

                        <td className='color1' onClick={() => history.push({pathname:"/view-transfers", state: {month: Number(month) + 1, year, accountName, accounts}})}><h3>
                            -{tOut.toLocaleString('en', {style: "currency", currency})}
                        </h3></td>

                        <td onClick={() => history.push({pathname:"/view-transfers", state: {month: Number(month) + 1, year, accountName, accounts}})}><h3>
                            {tIn.toLocaleString('en', {style: "currency", currency})}
                        </h3></td>

                        <td className={`verticalB ${netColor}`}><h3>
                            {net.toLocaleString('en', {style: "currency", currency})}
                        </h3></td>
                    </tr>
                </tbody>
            </table>
            <br/><br/>
    
        </>
    )
}

export default NetTable