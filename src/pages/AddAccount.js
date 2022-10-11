import React from 'react';
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import BorderDecorations, {BorderDecorationsBottom} from '../components/BorderDecoration';

function AddAccount() {
    const history = useHistory()
    const location = useLocation()
    const curUser = location.state.curUser
    const curRency = location.state.currency
    
    const [account, setName] = useState("")
    const [user, setUser] = useState(location.state.curUser)
    const [user2, setUser2] = useState("")
    const [currency, setCurrency] = useState("€")
    const [amount, setAmount] = useState(0)

    const addAccount = async () => {
        const resp = await fetch(`/accounts/`)
        const data = await resp.json()
        const accountNames = data.map((acct) => {return acct.account})

        for (const name of accountNames) {
            if (name == account){
                alert("That account name is already in use. Please use a different name")
                return
            }
        }
        

        const newAccount = {account, user, user2, currency, amount}
        const response = await fetch("/accounts", {
            method: "POST", 
            body: JSON.stringify(newAccount),
            headers: {"Content-type": "application/json"}
        })
        if (response.status === 201){
            alert("Successfully created a new account")
        } else{
            alert(`Create account failed. Status code = ${response.status}`)
        }

        history.push({pathname:"/accounts-view", state: {user: curUser, currency: curRency}})
    }

    return (
        <div>
            <BorderDecorations />
            <h3>Create a new account</h3>
            <div></div>

            <table><tbody>
                <tr>
                    <td className='button color1'>Account Name:</td>
                    <td className='button'></td>
                    <td className='button'>
                        <input 
                            type="text"
                            placeholder="Name"
                            value={account}
                            onChange={newN => setName(newN.target.value)} />
                    </td>
                </tr>
                <tr>
                    <td className='button color1'>User(s):</td>
                    <td className='button'></td>
                    <td className='button'>
                        <input 
                            type="text"
                            placeholder="User 1"
                            value={user}
                            onChange={newN => setUser(newN.target.value)} />
                        <input 
                            type="text"
                            placeholder="User 2 (optional)"
                            value={user2}
                            onChange={newN => setUser2(newN.target.value)} />
                    </td>
                </tr>
                <tr>
                    <td className='button color1'>Current Amount:</td>
                    <td className='right button'><select
                        className='currency'
                        value={currency}
                        onChange={newN => setCurrency(newN.target.value)} >
                            <option value="€">€</option>
                            <option value="$">$</option>
                    </select></td>
                    <td className='button'>
                        <input 
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={newN => setAmount(newN.target.value)} />
                    </td>
                </tr>
                <tr>
                    <td className='button color1'></td>
                    <td className='button'></td>
                    <td className='button'></td>
                </tr>
            </tbody></table>
            

            <table><tbody><tr>
                <td className="button"><button onClick={() => history.push({pathname:"/accounts-view", state: {user: curUser, currency: curRency}})} className="currency">Back</button></td>
                <td className="button"><button onClick={addAccount} className="button">Add</button></td>
            </tr></tbody></table>
            <BorderDecorationsBottom />
        </div>
    )
}

export default AddAccount
