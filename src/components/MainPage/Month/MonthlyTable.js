// The Month Table Component:
// Used on the MainPage and the PreviousSpendings Page
// Displays the table with all of the given month's spending data
        // uses the WeeklyRow Component to display its rows
        // includes each category in the header

import React, { useEffect, useState } from 'react';
import Week from "./WeeklyRow"

import { organizeDaysEntries, retrieveMonth, retrieveWeekEntries } from '../../../helperfuncs/FetchFunctions';
import { calculateWeekTotals } from '../../../helperfuncs/OtherCalcs';
import { createMonthDates } from '../../../helperfuncs/DateCalculators';

function MonthlyTable({data}) {
    const [date, user, accountName, currency, message, setMessage, viewWeek] = data

    // retrieves the information for the month to be displayed
    const [monthArr, setMonth] = useState([])
    const monthDatesArray = createMonthDates(date)

    const loadMonth = async () => {
        let monthArray = []
        for (let week of monthDatesArray) {
            // gets an array (7) of days, each day containing each entry for that day
            const days = await retrieveWeekEntries(week, user, accountName)
            let organizedDays = []
            for (let day of days){
                // sums the entries for each category for the day, returning an array of category sums
                const organized = await organizeDaysEntries(day, currency)
                organizedDays.push(organized)
            }
            // sums the entries for the week for each category
            let organizedWeek = calculateWeekTotals(organizedDays)
            organizedWeek[0] = week
            // adds each week's array of sums to an array for the month
            monthArray.push(organizedWeek)
        }
        setMessage(message)
        setMonth(monthArray)
    }


    // sums the entries for the month for each category
    const [total, setTotals] = useState(new Array(12).fill(0))

    const loadTotals = async () => {
        let totals = await retrieveMonth(Number(date.getMonth())+1, user, accountName)
        if (totals != undefined) setTotals(totals)
    }


    useEffect(() => {
        loadMonth()
        loadTotals()
    }, [])


    return(
        <table id="monthly">
            <thead>
                <tr className='toprow horizontalB'>
                    <th className='bold verticalB'></th>
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
                    <th className="verticalB">Total</th>
                </tr>
            </thead>
            <tbody>
                {monthArr.map((week, index) => <Week week={week} viewWeek={viewWeek} currency={currency} key={index}/>)}
                <tr className='horizontalB'>
                    <td className='corner verticalB'>Total</td>
                    {total.slice(1, 11).map((cat, index) => <td key={index}>{cat.toLocaleString('en', {style: "currency", currency: currency})}</td>)}
                    <td className='verticalB'>{total[11].toLocaleString('en', {style: "currency", currency: currency})}</td>
                </tr>
            </tbody>
        </table>
    )
}

export default MonthlyTable