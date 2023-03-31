// The Week Row Component:
// Used in the MonthlyTable Component
// Creates a row that composes each individual week to be displayed in the table

import React from 'react';

function Week({week, viewWeek, currency}) {
    const copyWeek = week.slice()

    // for visibility, if there is no value for a category, remains blank instead of showing 0
    for (let idx in week) {
        if (copyWeek[idx] === 0) copyWeek[idx] = ""
        else if (typeof(copyWeek[idx]) === "string") copyWeek[0] = week[0]
        else copyWeek[idx] = `${currency}${week[idx].toFixed(2)}`
    }
    return(
        <tr className='color1'>
            <td className='bold color2 dates'>
                {week[0]}
            </td>
            <td>
                {copyWeek[1]}
            </td>
            <td>
                {copyWeek[2]}
            </td>
            <td>
                {copyWeek[3]}
            </td>
            <td>
                {copyWeek[4]}
            </td>
            <td>
                {copyWeek[5]}
            </td>
            <td>
                {copyWeek[6]}
            </td>
            <td>
                {copyWeek[7]}
            </td>
            <td>
                {copyWeek[8]}
            </td>
            <td>
                {copyWeek[9]}
            </td>
            <td>
                {copyWeek[10]}
            </td>
            <td className='totalc color4'>
                {currency}{week.slice(1).reduce((a, b) => a + b, 0).toFixed(2)}
            </td>
            <td onClick={ () => viewWeek(week[0])} className="bold small color2">
                View Week
            </td>
        </tr>
    )
}

export default Week