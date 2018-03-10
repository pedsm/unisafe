# unisafe
UniSafe Backend

## Backend endpoitns

### Auth

### Data managment

- POST `/user` adds users to the database
```JSON
{
    "name": "Pedro",
    "photo": "https://...jpg",
    "fbId": "1"
} 
```

- POST `/group` creates a group
```JSON
{
    "createdBy": "1",
    "postcode": "ng81bb"
} 
```

- POST `/group/request` requests a friend to join

// TODO make this endpoint safe as in user checking
```JSON
Request body
{
    "groupId": "20",
    "fbId": "1"
}
```
