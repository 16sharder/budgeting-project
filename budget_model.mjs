import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;




const entrySchema = mongoose.Schema({
    // creates a Schema that is used as a basis for all entry objects created
    account: { type: String, required: true },
    category: { type: String, required: true },
    currency: { type: String, required: true },
    amount: {type: Number, required: true},
    date: { type: String, required: true },
    description: { type: String, required: true }
})

// creates an Entry model class based on the precreated Schema
const Entry = mongoose.model("Entry", entrySchema)

const createEntry = async(account, category, currency, amount, date, description) => {
    // uses the Entry class to create a new entry object with all required parameters
    const entry = new Entry({account: account, category: category, currency: currency, amount: amount, date: date, description: description})
    return entry.save()
}



const getAllEntries = async() => {
    // retrieves all the entries in existence in the database
    const query = Entry.find({})
    return query.exec()
}

const findEntries = async(filter) => {
    // finds the entries of a certain date and returns them if in existence
    const query = Entry.find(filter)
    return query.exec()
}


const updateEntry = async(filter, update) => {
    // finds the entry of a certain id, then updates the provided criteria for that entry
    await Entry.updateOne(filter, update)
    const query = Entry.find(filter)
    return query.exec()
}


const deleteEntry = async(filter) => {
    // finds the entry of a certain id and deletes it if in existence
    const response = await Entry.deleteOne(filter)
    return response.deletedCount
}








const accountSchema = mongoose.Schema({
    // creates a Schema that is used as a basis for all account objects created
    account: { type: String, required: true },
    user: { type: String, required: true },
    user2: { type: String, required: false },
    currency: { type: String, required: true },
    amount: {type: Number, required: true},
})

// creates an Account model class based on the precreated Schema
const Account = mongoose.model("Account", accountSchema)

const createAccount = async(account, user, currency, amount, user2) => {
    // uses the Account class to create a new account object with all required parameters
    const acct = new Account({account: account, user: user, currency: currency, amount: amount, user2: user2})
    return acct.save()
}



const getAllAccounts = async(user) => {
    // retrieves all the accounts for the user in existence in the database
    // substitute: make sure both user and user 2 are being searched -- solution found, needs testing
    const query = Account.find({ $or: [{user: user}, {user2: user}, {account: user}]})
    return query.exec()
}

const findAccount = async(filter) => {
    // finds the accounts of a certain id and returns them if in existence
    const query = Account.find(filter)
    return query.exec()
}


const updateAccount = async(filter, update) => {
    // finds the account of a certain id, then updates the provided criteria for that account
    await Account.updateOne(filter, update)
    const account = findAccount(filter)
    return account
}


const deleteAccount = async(filter) => {
    // finds the account of a certain id and deletes it if in existence
    const response = await Account.deleteOne(filter)
    return response.deletedCount
}







db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

export {createEntry, getAllEntries, findEntries, updateEntry, deleteEntry, createAccount, getAllAccounts, findAccount, updateAccount, deleteAccount}
