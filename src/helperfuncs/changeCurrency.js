async function changeCurrency() {
    const response = await fetch(`/transfers`)
    if (response.status !== 200) {
        return undefined
    }
    const data = await response.json()

    for (const entry of data){
        let editedEntry = {}
        if (entry.currency2 == "$") editedEntry = {currency2: "USD"}
        else if (entry.currency2 == "€") editedEntry = {currency2: "EUR"}
        else continue

        const response = await fetch(`/transfers/${entry._id}`, {
            method: "PUT", 
            body: JSON.stringify(editedEntry),
            headers: {"Content-type": "application/json"}
        })
    }

    console.log("complete")
}

export default changeCurrency