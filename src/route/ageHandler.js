const ageHandler = async request => {

    const { searchParams } = new URL(request.url)

    const birthDay = searchParams.get("birthday") || null;

    if (birthDay != null) {

        const birthDayDate = new Date(birthDay)
        const currentDate = new Date()

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
