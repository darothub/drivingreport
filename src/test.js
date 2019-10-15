let arr = [
    {
        "tripID": "8aa40609-6b7d-4db1-a0de-2d508337b8b4",
        "driverID": "d247da84-ffcb-4ca8-8459-f98c99b59822",
        "isCash": true,
        "billedAmount": "1,715.16",
        "user": {
            "name": "Aurelia Rios",
            "gender": "female",
            "company": "EXERTA",
            "email": "aureliarios@exerta.com",
            "phone": "+234 808-375-2326"
        },
        "created": "2019-01-21T08:24:05+01:00",
        "pickup": {
            "address": "311 Woodbine Street, Catharine, Kentucky, 8240",
            "latitude": -7.99591,
            "longitude": 177.770392
        },
        "destination": {
            "address": "76 Cornelia Street, Tyro, Idaho, 8547",
            "latitude": 8.056252,
            "longitude": -103.758085
        }
    },
    {
        "tripID": "c2812789-d50b-4324-ab8e-0ad7348b4694",
        "driverID": "f28f085a-0746-475e-b266-6608c96e1472",
        "isCash": true,
        "billedAmount": "3,372.07",
        "user": {
            "name": "Walton Deleon",
            "gender": "male",
            "company": "KOG",
            "email": "waltondeleon@kog.com",
            "phone": "+234 809-134-9823"
        },
        "created": "2019-04-18T08:20:48+01:00",
        "pickup": {
            "address": "685 Rewe Street, Sims, Florida, 2202",
            "latitude": -86.641563,
            "longitude": -79.047428
        },
        "destination": {
            "address": "51 Remsen Avenue, Leeper, New Jersey, 6794",
            "latitude": 30.904381,
            "longitude": 123.08562
        }
    },
]

let users = arr.map(item => {
    
    return {
        "user":item.user.name, 
        "created": item.created, 
        "pickup": item.pickup.address, 
        "destination": item.destination.address, 
        "billed": item.billedAmount,
        "isCash": item.isCash
    }
})

console.log(users)