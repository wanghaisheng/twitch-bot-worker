const ageHandler = async () => {

    const birthDay = new Date(BIRTHDAY)
    const currentDate = new Date()

    let currentAge = currentDate.getFullYear() -  birthDay.getFullYear()
    let month = currentDate.getMonth() -  birthDay.getMonth()

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        currentAge--
    }

    return new Response(currentAge, { 
        status: 200,
        statusText: 'OK',
        headers: {
            'content-type': 'text/plain'
        }
    })
}

export default ageHandler
