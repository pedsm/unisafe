# unisafe
UniSafe Backend

## Backend endpoitns

### Auth

### Data managment

- POST `/user` adds users to the database
```JSON
{
    "name": "Pedro Mendonca",
    "phone": "123",
    "initials": "PM"
} 
```

- POST `/friend` adds friendship
```JSON
{
    "phoneA": "123",
    "phoneB": "124"
}
```

- POST `/group` creates a group
```JSON
{
    "phone": '123',
    "postcode": 'ng71lr'
} 
```

- POST `/group/request` requests a friend to join

// TODO make this endpoint safe as in user checking

```JSON
Request body
{
    "phone": "124",
    "groupId": 20
}
```

- POST `/group/accept` accepts an invitation

// TODO make this endpoint safe as in user checking

```JSON
Request body
{
    "phone": "124",
    "groupId": 20,
    "postcode": "ng71lr"
}
```
