const fetch = require('node-fetch')

const queries = [
    {
        comment: 'Add first user',
        action: 'POST',
        endPoint: 'user',
        body: {
            name: "Pedro Mendonca",
            phone: "123",
            initials: "PM",
            token: "coijaodncowadPM"
        },
    },
    {
        comment: 'Add second user',
        action: 'POST',
        endPoint: 'user',
        body: {
            name: "Lawrie Cate",
            phone: "124",
            initials: "LC",
            token: "jdioawjd29103u0hd10"
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
    {
        comment: 'Making a group',
        action: 'POST',
        endPoint: 'group',
        body: {
            phone: '123',
            postcode: 'ng71lr'
        },
    },
    {
        comment: 'Inviting friend',
        action: 'POST',
        endPoint: 'group/request',
        body: { },
    },
    {
        comment: 'Accept Invite',
        action: 'POST',
        endPoint: 'group/accept',
        body: { },
    }
]

async function test() {
    let groupId = null
    for(query of queries) {
        console.log(query.comment)
        try {
            const res = await fetch(`http://localhost:3000/${query.endPoint}`, {
                headers: {
                    'content-type': 'application/json'
                },
                method: query.action,
                body: (query.endPoint == 'group/request' || 
                    query.endPoint == 'group/accept')
                ? JSON.stringify({
                    postcode: 'ng81bb',
                    phone: '124',
                    groupId
                }) : JSON.stringify(query.body)
            })
            lastResponse = await res.json()
            if(query.endPoint === 'group') {
                groupId = lastResponse.groupId
            }
            console.log(lastResponse)
        } catch(e) {
            console.error(`Error on query ${JSON.stringify(query)}(${e.message})`)
        }
    }
}
test()
