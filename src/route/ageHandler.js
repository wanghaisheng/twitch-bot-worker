const ageHandler = async request => {

    const { searchParams } = new URL(request.url)

    const day = searchParams.get("day") || null;

    if (day != null) {

        const birthDay = new Date(day)
        const currentDate = new Date()

        let currentAge = currentDate.getFullYear() -  birthDay.getFullYear()
        let month = currentDate.getMonth() -  birthDay.getMonth()

        if (month < 0 || (month === 0 && currentDate.getDate() < birthDate.getDate())) {
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

    return new Response('404 Not Found', {
        status: 404,
        statusText: 'Not Found',
        headers: {
            'content-type': 'text/plain',
        },
    })
}

export default ageHandler
