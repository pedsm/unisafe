const fetch = require('node-fetch')

const queries = [
    {
        comment: 'Add first user',
        action: 'POST',
        endPoint: 'user',
        body: {
            name: "Pedro Mendonca",
            phone: "123",
            initials: "PM"
        },
    },
    {
        comment: 'Add second user',
        action: 'POST',
        endPoint: 'user',
        body: {
            name: "Lawrie Cate",
            phone: "124",
            initials: "LC"
        },
    },
    {
        comment: 'Add friendship',
        action: 'POST',
        endPoint: 'friend',
        body: {
            phoneA: "123",
            phoneB: "124"
        },
    },
]

async function test() {
    for(query of queries) {
        console.log(query.comment)
        try {
            console.log(JSON.stringify(query.body))
            const res = await fetch(`http://localhost:3000/${query.endPoint}`, {
                headers: {
                    'content-type': 'application/json'
                },
                method: query.action,
                body: JSON.stringify(query.body)
            })
            const json = await res.json()
            console.log(json)
        } catch(e) {
            console.error(`Error on query ${i}(${e.message})`)
        }
    }
}
test()
