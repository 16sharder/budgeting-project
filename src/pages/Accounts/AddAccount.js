// The Add New Account Page:
// Shown when the user has pressed the Add New Account button on the Accounts Page
// Displays a form for the user to fill in all the data for their new account
// Sends the user back to the Accounts Page

import React, { useEffect } from 'react';
import {useState} from "react"
import {useHistory} from "react-router-dom"

import { reloadAccounts, useRAccountsDispatch } from '../../helperfuncs/UpdateFunctions';

import BasicBorders, {BorderFlourish} from '../../components/Styling/BorderDecoration';
import { AmountEntry } from '../../components/Forms/Inputs';

function AddAccount() {
    const history = useHistory()

    const [currentUser, accounts, dispatch] = useRAccountsDispatch()

    const accountNames = accounts.map((acct) => acct.account)
    const banks = Array.from(new Set(accounts.map((acct) => acct.bank)))
    
    const [account, setName] = useState("")
    const [bank, setBank] = useState("")
    const [user, setUser] = useState(currentUser)
    const [user2, setUser2] = useState("")
    const [currency, setCurrency] = useState("EUR")
    const [currencySymbol, setSymbol] = useState("")
    const [amount, setAmount] = useState(0)

    // event listener for when user presses Enter
    const input = document.getElementById("input")

    const checkKey = (key, children) => {
        if (key == "Enter") {
            addAccount({account: children[0].children[2].children[0].value, 
                bank: children[1].children[2].children[0].value,  
                user: children[2].children[2].children[0].value, 
                user2: children[2].children[2].children[1].value, 
                currency: children[3].children[2].children[0].value,
                amount: children[4].children[2].children[0].value})} 
    }

    const addAccount = async (newAccount) => {
        for (const name of accountNames) {
            if (name == newAccount.account){
                alert("That account name is already in use. Please use a different name")
                return
            }
        }
        
        newAccount = {account, bank, user, user2, currency, amount}
        const response = await fetch("/accounts", {
            method: "POST", 
            body: JSON.stringify(newAccount),
            headers: {"Content-type": "application/json"}
        })

        await reloadAccounts(currentUser, dispatch)

        if (response.status === 201){
            alert("Successfully created a new account")
            history.push({pathname:"/accounts-view"})
        } else{
            alert(`Create account failed. Status code = ${response.status}`)
        }
    }

    useEffect(() => {
        let ext;
        try {
            ext = Number(0).toLocaleString("en", {style: "currency", currency: currency})
        } catch (error) {
            ext = " "
        }
        setSymbol(ext[0])
    }, [currency])

    useEffect(() => {
        if (input != undefined) {
            const children = input.children
            input.addEventListener("keypress", (key) => checkKey(key.key, children))
            return () => input.removeEventListener("keypress", (key) => checkKey(key, children))
        }
    }, [input])


    return (
        <>
            <BasicBorders/>
            <BorderFlourish/>
            <div className='holder'>
            <h3>Create a new account</h3>
            <div></div>

            <table className='form'><tbody id="input">
                <tr>
                    <td>Account Name:</td>
                    <td></td>
                    <td>
                        <input 
                            type="text"
                            placeholder="Name"
                            value={account}
                            onChange={newN => setName(newN.target.value)} />
                    </td>
                </tr>
                <tr>
                    <td>Bank:<br/><br/></td>
                    <td></td>
                    <td>
                        <input 
                            type="text"
                            placeholder="New Bank"
                            value={bank}
                            onChange={newN => setBank(newN.target.value)} />
                        <select
                            value={bank}
                            onChange={newN => setBank(newN.target.value)} >
                                <option value={""}>-New Bank-</option>
                                {banks.map((bank, index) => <option value={bank} key={index}>{bank}</option>)}
                        </select>
                        <br/><br/>
                    </td>
                </tr>
                <tr>
                    <td>User(s):</td>
                    <td></td>
                    <td>
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
                    <td>Currency:</td>
                    <td></td>
                    <td>
                        <input 
                            type="text"
                            placeholder="Currency Code (3 letters)"
                            maxLength={3}
                            value={currency}
                            onChange={newN => setCurrency(newN.target.value)} />
                    </td>
                </tr>
                <AmountEntry data={[currencySymbol, amount, setAmount, "Current Amount:"]}/>
            </tbody></table>
            
            

            <table className='twoButtons'><tbody><tr>
                <td><button onClick={() => history.push({pathname:"/accounts-view"})}>Back</button></td>
                <td></td>
                <td><button onClick={() => addAccount({account, bank, user, user2, currency, amount})}>Add</button></td>
            </tr></tbody></table>
            </div>
        </>
    )
}

export default AddAccount
