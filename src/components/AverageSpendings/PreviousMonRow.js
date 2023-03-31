import React from 'react';

function Month({month, viewMonth, currency}) {
    return(
        <tr className='color1'>
            <td className='bold color2 dates' onClick={ () => viewMonth(month[0])}>
                {month[0]}
            </td>
            <td onClick={ () => viewMonth(month[12])}>
                {currency}{month[1].toFixed(2)}
            </td>
            <td onClick={ () => viewMonth(month[12])}>
                {currency}{month[2].toFixed(2)}
            </td>
            <td onClick={ () => viewMonth(month[12])}>
                {currency}{month[3].toFixed(2)}
            </td>
            <td onClick={ () => viewMonth(month[12])}>
                {currency}{month[4].toFixed(2)}
            </td>
            <td onClick={ () => viewMonth(month[12])}>
                {currency}{month[5].toFixed(2)}
            </td>
            <td onClick={ () => viewMonth(month[12])}>
                {currency}{month[6].toFixed(2)}
            </td>
            <td onClick={ () => viewMonth(month[12])}>
                {currency}{month[7].toFixed(2)}
            </td>
            <td onClick={ () => viewMonth(month[12])}>
                {currency}{month[8].toFixed(2)}
            </td>
            <td onClick={ () => viewMonth(month[12])}>
                {currency}{month[9].toFixed(2)}
            </td>
            <td onClick={ () => viewMonth(month[12])}>
                {currency}{month[10].toFixed(2)}
            </td>
            <td className='totalc color4' onClick={ () => viewMonth(month[12])}>
                {currency}{month[11].toFixed(2)}
            </td>
        </tr>
    )
}

export default Month