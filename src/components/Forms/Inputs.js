import React from 'react';


function AccountSelector ({data}) {
    const [account, setAccount, accounts, label] = data

    const displayAmount = (account) => {
        if (label == "Bank Account:") return ""
        else return `(${account.amount.toLocaleString('en', {style: "currency", currency: account.currency})})`
    }

    return (
        <tr>
            <td>{label}</td>
            <td></td>
            <td><select
                value={account}
                onChange={newN => setAccount(newN.target.value)} >
                    {accounts.map((account, index) => <option value={account.account} key={index}>
                        {account.account} {displayAmount(account)}</option>)}
            </select></td>
        </tr>
    )
}


function CategorySelector ({data}) {
    const [category, setCategory] = data
    const catsArray = ["Groceries", "Eating Out", "Clothing", "House Supplies", "Work Supplies", "Travel", "Bills", "Cash", "Emergencies", "Other"]
    return(
        <tr>
            <td>Category:</td>
            <td></td>
            <td><select
                value={category}
                onChange={newN => setCategory(newN.target.value)} >
                    {catsArray.map((cat, index) => 
                    <option value={cat} key={index}>{cat}</option>)}
            </select></td>
        </tr>
    )
}


function AmountEntry ({data}) {
    const [currencySymbol, amount, setAmount, message] = data
    return(
        <tr>
            <td>{message}</td>
            <td className='right color1'>{currencySymbol}</td>
            <td>
                <input 
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={newN => setAmount(newN.target.value)} />
            </td>
        </tr>
    )
}

function RateEntry ({data}) {
    const [exchangeRate, setExchangeRate] = data
    return (
        <tr>
            <td>Exchange Rate:</td>
            <td></td>
            <td>
                <input 
                    type="number"
                    placeholder="1"
                    value={exchangeRate}
                    onChange={newN => setExchangeRate(newN.target.value)} />
            </td>
        </tr>
    )
}


function DateEntry ({data}) {
    const [date, setDate] = data
    return (
        <tr>
            <td>Date:</td>
            <td></td>
            <td>
                <input 
                    type="date"
                    value={date}
                    onChange={newN => setDate(newN.target.value)} />
            </td>
        </tr>
    )
}


function DescriptionEntry ({data}) {
    const [description, setDescription] = data
    return(
        <tr>
            <td>Descripton:</td>
            <td></td>
            <td>
                <input 
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={newN => setDescription(newN.target.value)} />
            </td>
        </tr>
    )
}

export {AccountSelector, CategorySelector, AmountEntry, RateEntry, DateEntry, DescriptionEntry}