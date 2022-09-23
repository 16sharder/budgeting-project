
// calculates all the individual dates of a week
function calcWeekDates(week) {
    const dashIndex = week.indexOf("-")
    const slashIndex = week.indexOf("/")

    let date = Number(week.slice(slashIndex + 1, dashIndex))
    let int = 0
    const month = Number(week.slice(0, slashIndex))
    const end = calcMonthEnd(month)

    let weekDates = []

    // determines if the week is at the end of a month
    if (date + 6 > end) {
        const last = end - date
        let incre = last
        while (incre != -1) {
            weekDates.push(`${month}/${date}`)
            date += 1
            int += 1
            incre -= 1
        }
        while (int != 7) {
            weekDates.push(`${month + 1}/${date - end}`)
            date += 1
            int += 1
        }
    }

    // calculates each date in that week
    else {while (int != 7) {
        weekDates.push(`${month}/${date}`)
        date += 1
        int += 1
    }}

    return weekDates
}


// calculates the last day of the given month
function calcMonthEnd (month) {
    const thirtyDays = [4, 6, 9, 11]
    let monthEnd = 31
    if (month == 2) {monthEnd = 28}
    else if (thirtyDays.includes(month)) {monthEnd = 30}
    return monthEnd
}


// calculates the start and end dates of each week in the month, returning those dates in an array
function createMonthDates(date) {
    const mo = date.getMonth() + 1
    const day = date.getDate()
    const weekday = date.getDay()


    // calculates the first day of the first week of the month
    let weekStart = day - weekday
    while (weekStart > 1){
        weekStart -= 7
    }


    //determines the array of weeks for that month
    let weekArray = []
    // if the start of the week is the first day of the month
    if (weekStart == 1) {
        const monthEnd = calcMonthEnd(mo)
        if (monthEnd == 28){
            weekArray = [`${mo}/${weekStart}-${mo}/${weekStart+6}`, 
                        `${mo}/${weekStart+7}-${mo}/${weekStart+7+6}`,
                        `${mo}/${weekStart+14}-${mo}/${weekStart+14+6}`,
                        `${mo}/${weekStart+21}-${mo}/${weekStart+21+6}`]
        }else {
            weekArray = [`${mo}/${weekStart}-${mo}/${weekStart+6}`, 
                        `${mo}/${weekStart+7}-${mo}/${weekStart+7+6}`,
                        `${mo}/${weekStart+14}-${mo}/${weekStart+14+6}`,
                        `${mo}/${weekStart+21}-${mo}/${weekStart+21+6}`,
                        `${mo}/${weekStart+28}-${mo+1}/${weekStart+28+6-monthEnd}`]
        }
    // if the start of the week is not the first day of the month
    } else {
        const thisMonthEnd = calcMonthEnd(mo)
        const preMonthEnd = calcMonthEnd(mo-1)
        // if the end of the week is the last day of the month
        if (weekStart+28+6-thisMonthEnd <= 0) {
            weekArray = [`${mo-1}/${preMonthEnd+weekStart}-${mo}/${weekStart+6}`, 
                        `${mo}/${weekStart+7}-${mo}/${weekStart+7+6}`,
                        `${mo}/${weekStart+14}-${mo}/${weekStart+14+6}`,
                        `${mo}/${weekStart+21}-${mo}/${weekStart+21+6}`,
                        `${mo}/${weekStart+28}-${mo}/${weekStart+28+6}`]
        }
        // if the end of the week is not the last day of the month
        else {weekArray = [`${mo-1}/${preMonthEnd+weekStart}-${mo}/${weekStart+6}`, 
                        `${mo}/${weekStart+7}-${mo}/${weekStart+7+6}`,
                        `${mo}/${weekStart+14}-${mo}/${weekStart+14+6}`,
                        `${mo}/${weekStart+21}-${mo}/${weekStart+21+6}`,
                        `${mo}/${weekStart+28}-${mo+1}/${weekStart+28+6-thisMonthEnd}`]
    }}

    return weekArray
}


// converts dates to the format used by mongoDB for find filter
function convertDate (date) {
    const today = new Date()
    const year = today.getFullYear()

    let newDate = ""
    const dashIndex = date.indexOf("/")
    if (dashIndex === 1){
        if (date.length === 3){
            newDate = `${year}-0${date[0]}-0${date[2]}`
        }
        else newDate = `${year}-0${date[0]}-${date.slice(2, 4)}`
    } else {
        if (date.length === 4){
            newDate = `${year}-${date.slice(0, 2)}-0${date[3]}`
        }
        else newDate = `${year}-${date}`
    }

    return newDate
}

export {calcWeekDates, calcMonthEnd, createMonthDates, convertDate}