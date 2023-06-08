// The Averages Table Component:
// Used on the MainPage
// Displays the table with the user's monthly spending data for the past 6 months
        // uses the MonthlyRow Component to display its rows
        // includes each category in the header

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { retrieveMonth, retrieveMultipleMonths } from '../../helperfuncs/FetchFunctions';
import Month from './MonthlyRow';

function AveragesTable({user, currency}) {
    const history = useHistory()

    const today = new Date()
    let month = (today.getMonth())

    // retrieves each individual month's spendings
    const [results, setResults] = useState([])

    const loadMonths = async () => {
        let [res, y, nums, next] = [[], 1, [month], month]
        
        while (y != 6) {
            if (next == 1) {
                next = 12
            } else next = next - 1
            nums.push(next)
            y += 1
        }
        for (let month of nums) {
            let mo = await retrieveMonth(month, user)
            if (mo[11] != 0) res.push(mo)
            if (month == 0) {
                month = 12
            } else {month -= 1}
        }
        setResults(res.reverse())
        return res
    }



    // retrieves the persons average spendings for the past 6 months
    const [averages, setAverages] = useState(new Array(11).fill(0))

    const loadAve = async () => {
        const months = await loadMonths()
        const res = await retrieveMultipleMonths(months, user)
        if (res[11] == 0) res[11] = 1

        const avgs = res.slice(0, 11).map((cat) => cat / res[11])
        setAverages(avgs)
    }

    useEffect(() => {
        loadMonths()
        loadAve()
    }, [])

    // sends the user to a page displaying the desired week's information
    const viewMonth = async month => {
        history.push({pathname:"/previous-spendings", state: {user, currency, month, accountName: "All Accounts"}})
    }

    return(
        <table>
            <thead>
                <tr className='bold horizontalB color2'>
                    <th className='corner verticalB'>Month</th>
                    {["Groceries", "Eating Out", "Clothing", "House Supplies", "Work Supplies", "Travel", "Bills", "Cash", "Emergency", "Other"].map(
                        (label, index) => <th key={index}>{label}</th>)}
                    <th className="bold verticalB">Total</th>
                </tr></thead>
            <tbody>
            {results.map((month, index) => <Month month={month} viewMonth={viewMonth} currency={currency} key={index}/>)}
                <tr className='horizontalB'>
                    <th className='corner verticalB'>Average</th>
                    {averages.slice(0, 10).map((cat, index) => <th key={index}>{cat.toLocaleString('en', {style: "currency", currency: currency})}</th>)}
                    <th className='verticalB'>{averages[10].toLocaleString('en', {style: "currency", currency: currency})}</th>
                </tr>
            </tbody>
        </table>
    )
}

export default AveragesTable