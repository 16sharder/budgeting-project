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
    let month = (today.getMonth() + 1)

    // retrieves each individual month's spendings
    const [results, setResults] = useState([])

    const loadMonths = async () => {
        let res = []
        let y = 1
        let nums = [month]
        let next = month
        while (y != 7) {
            if (next == 1) {
                next = 12
            } else next = next - 1
            nums.push(next)
            y += 1
        }
        for (let month of nums) {
            let mo = await retrieveMonth(month, user)
            res.push(mo)
            if (month == 0) {
                month = 12
            } else {month -= 1}
        }
        setResults(res.slice(1).reverse())
    }



    // retrieves the persons average spendings for the past 6 months
    const [aveGroc, setGroc] = useState(0)
    const [aveEat, setEat] = useState(0)
    const [aveClo, setClo] = useState(0)
    const [aveHous, setHous] = useState(0)
    const [aveWork, setWork] = useState(0)
    const [aveTrav, setTrav] = useState(0)
    const [aveBil, setBil] = useState(0)
    const [aveCash, setCash] = useState(0)
    const [aveEmr, setEmr] = useState(0)
    const [aveOth, setOth] = useState(0)
    const [aveTot, setTot] = useState(0)

    const loadAve = async () => {
        const results = await retrieveMultipleMonths(month-1, user, 7)

        setGroc(results[0] / results[11])
        setEat(results[1] / results[11])
        setClo(results[2] / results[11])
        setHous(results[3] / results[11])
        setWork(results[4] / results[11])
        setTrav(results[5] / results[11])
        setBil(results[6] / results[11])
        setCash(results[7] / results[11])
        setEmr(results[8] / results[11])
        setOth(results[9] / results[11])
        setTot(results[10] / results[11])
    }

    useEffect(() => {
        loadMonths()
        loadAve()
    }, [])

    // sends the user to a page displaying the desired week's information
    const viewMonth = async month => {
        history.push({pathname:"/previous-spendings", state: {user: user, currency: currency, month: month, accountName: "All Accounts"}})
    }

    return(
        <table>
            <thead>
                <tr className='bold horizontalB color2'>
                    <th className='corner verticalB'>Month</th>
                    <th>Groceries</th>
                    <th>Eating Out</th>
                    <th>Clothing</th>
                    <th>House Supplies</th>
                    <th>Work Supplies</th>
                    <th>Travel</th>
                    <th>Bills</th>
                    <th>Cash</th>
                    <th>Emergency</th>
                    <th>Other</th>
                    <th className="bold verticalB">Total</th>
                </tr></thead>
            <tbody>
            {results.map((month, index) => <Month month={month} viewMonth={viewMonth} currency={currency} key={index}/>)}
                <tr className='horizontalB'>
                    <th className='corner verticalB'>Average</th>
                    <th>{currency}{aveGroc.toFixed(2)}</th>
                    <th>{currency}{aveEat.toFixed(2)}</th>
                    <th>{currency}{aveClo.toFixed(2)}</th>
                    <th>{currency}{aveHous.toFixed(2)}</th>
                    <th>{currency}{aveWork.toFixed(2)}</th>
                    <th>{currency}{aveTrav.toFixed(2)}</th>
                    <th>{currency}{aveBil.toFixed(2)}</th>
                    <th>{currency}{aveCash.toFixed(2)}</th>
                    <th>{currency}{aveEmr.toFixed(2)}</th>
                    <th>{currency}{aveOth.toFixed(2)}</th>
                    <th className='verticalB'>{currency}{aveTot.toFixed(2)}</th>
                </tr>
            </tbody>
        </table>
    )
}

export default AveragesTable