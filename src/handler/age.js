/*
 * MIT License
 *
 * Copyright (c) 2022 Kasper Stad
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import notFound from '../handler/notFound'

const age = async req => {

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

    return await notFound()
}

export default age
