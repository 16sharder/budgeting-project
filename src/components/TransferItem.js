import React from "react";

import { FiEdit } from "react-icons/fi";
import { stringifyDate } from "../helperfuncs/DateCalculators";

function TransferItem ({ data }) {
    const [index, transfer, editTransfer] = data
    return(
        <>
            <table className='singleColumn'>
                <thead><tr className='toprow'><th>Transfer {index+1}
                    <FiEdit className="edit" onClick={() => editTransfer(transfer)}/></th></tr></thead>
                <tbody><tr><td className='color1'>

                    <table className='inTransfer'><tbody>
                        <tr>
                            <td className='edge boldText'>From:<br/>To:</td>
                            <td>{transfer.account}<br/>{transfer.account2}</td>
                            <td className='edge'>{transfer.amount.toLocaleString('en', {style: "currency", currency: transfer.currency})}
                            <br/>{(transfer.amount * transfer.exchangeRate).toLocaleString('en', {style: "currency", currency: transfer.currency2})}</td>
                        </tr>
                    </tbody></table>

                    <table className='inTransfer'><tbody>
                        <tr>
                            <td className='edge boldText'>Fee:</td>
                            <td>{transfer.fee.toLocaleString('en', {style: "currency", currency: transfer.currency})}</td>
                            <td className='boldText' style={{borderLeft: "2px solid"}}>Date:</td>
                            <td className='edge'>{stringifyDate(transfer.date)}</td>
                        </tr>
                    </tbody></table>
                    
                    <table className='inTransfer' style={{borderBottom: "2px solid"}}><tbody>
                        <tr>
                            <td className='boldText descrip'>Description: </td>
                            <td>{transfer.description}</td>
                        </tr>
                    </tbody></table>
                </td></tr></tbody>
            </table>
        </>
    )
}

export default TransferItem