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
        else copyWeek[idx] = `${week[idx].toLocaleString('en', {style: "currency", currency: currency})}`
    }
    return(
        <tr className='color1' onClick={ () => viewWeek(week[0])}>
            <td className='verticalB bold color2 dates'>{week[0]}</td>
            
            {copyWeek.slice(1, 12).map((cat, index) => <td key={index}>{cat}</td>)}

            <td className='verticalB color4'>
                {week.slice(1, 11).reduce((a, b) => a + b, 0).toLocaleString('en', {style: "currency", currency: currency})}
            </td>
        </tr>
    )
}

export default Week