const ageHandler = async req => {

    const { searchParams } = new URL(req.url)

    const birthDay = searchParams.get("birthday") || null;

    if (birthDay != null) {

        const tzDate = new Date().toLocaleString('en-US', {timeZone: TZ})
        const currentDate = new Date(tzDate)

        const birthDayDate = new Date(birthDay)

        let currentAge = currentDate.getFullYear() -  birthDayDate.getFullYear()
        let month = currentDate.getMonth() -  birthDayDate.getMonth()

        if (month < 0 || (month === 0 && currentDate.getDate() < birthDayDate.getDate())) {
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

    return new Response('Invalid API query', {
        status: 404,
        statusText: 'Not Found',
        headers: {
            'content-type': 'text/plain',
        },
    })
}

export default ageHandler
