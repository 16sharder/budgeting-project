import React, { useEffect, useState } from 'react';
import {useLocation} from "react-router-dom"

import { monthName, monthNumString } from '../../helperfuncs/DateCalculators';

import NetTable from '../../components/MainPage/NetTable';
import BasicBorders, {NoBorderFlourish} from '../../components/Styling/BorderDecoration';
import Navigation from '../../components/Styling/Navigation';

function PreviousMonth () {

    const location = useLocation()

    const {user, month, lastUsed} = location.state
    let {currency} = location.state

    const monthNumStr = monthNumString(month)

    // retrieves the appropriate year
    const today = new Date
    let year = today.getFullYear()
    if (month > today.getMonth()) {year = year - 1}


    const [accounts, setAccounts] = useState([])

    const loadAccounts = async (user) => {
        const response = await fetch(`/accounts/${user}`)
        const data = await response.json()
        setAccounts(data)
    }

    // loads everything
    useEffect(() => {
        loadAccounts(user)
    }, [])

    return (
        <><div className='box'>
            <BasicBorders/>
            <NoBorderFlourish/>
            <Navigation user={user} currency={currency} lastUsed={lastUsed}/>
            <p></p>

            <h2>Financials in {monthName(month)}</h2>
            <div>Click on a section to view more details</div>
            <NetTable data={[user, "All Accounts", "All Accounts", accounts, currency, monthNumStr, month, year, lastUsed]}/>
            {accounts.map((account, index) => 
            <NetTable data={[user, account.account, account.account, accounts, currency, monthNumStr, month, year, lastUsed]} key={index}/>)}

            <p></p>
        </div></>
    )
}

export default PreviousMonth