# unisafe
UniSafe Backend

## Backend endpoitns

### Auth

### Data managment

- POST `/user` adds users to the database
```JSON
{
    "name": "Pedro",
    "phone": "913021841",
    "initials": "PM"
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
    "userId": "1"
}
```
