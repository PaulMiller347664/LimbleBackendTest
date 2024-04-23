0. Delete existing database in docker
1. uncomment out dummy data code that is commented out in index.js
2. run code with docker compose up
3. hit the following urls checking that the logs look good.
4. http://localhost:3000/workers/totalCost?workerIds=1 expects 
    {
        "worker_id": 1,
        "username": "john_doe",
        "total_cost": "41.33"
    }
5. http://localhost:3000/workers/totalCost?workerIds=1,2,3 expects
[
    {
        "worker_id": 1,
        "username": "john_doe",
        "total_cost": "41.33"
    },
    {
        "worker_id": 2,
        "username": "jane_smith",
        "total_cost": "25.00"
    },
    {
        "worker_id": 3,
        "username": "alex_jones",
        "total_cost": "15.00"
    }
]
6. http://localhost:3000/workers/totalCost?workerIds=1,2,3&locationIds=2 expects
[
    {
        "worker_id": 1,
        "username": "john_doe",
        "total_cost": "15.50"
    },
    {
        "worker_id": 2,
        "username": "jane_smith",
        "total_cost": "25.00"
    }
]
7. http://localhost:3000/workers/totalCost?workerIds=1,2,3&locationIds=2&isComplete=false expects
[
    {
        "worker_id": 1,
        "username": "john_doe",
        "total_cost": "15.50"
    },
    {
        "worker_id": 2,
        "username": "jane_smith",
        "total_cost": "15.62"
    }
]
8. http://localhost:3000/workers/totalCost?locationIds=2&isComplete=false expects exception in logs 'cannot search by workers without worker ids please retry'
9. http://localhost:3000/workers/totalCost?workerIds=-1,2,3&locationIds=2&isComplete=false expects exception in logs 'Worker id is invalid please use a non negative number. Worker Ids -1,2,3'
10. http://localhost:3000/locations/totalCost?locationIds=2 expects
[
    {
        "location_id": 2,
        "location_name": "Office B",
        "total_cost": "40.49"
    }
]
11. http://localhost:3000/locations/totalCost?locationIds=1,2,3 expects
[
    {
        "location_id": 1,
        "location_name": "Office A",
        "total_cost": "25.83"
    },
    {
        "location_id": 2,
        "location_name": "Office B",
        "total_cost": "40.49"
    },
    {
        "location_id": 3,
        "location_name": "Warehouse",
        "total_cost": "15.00"
    }
]
12. http://localhost:3000/locations/totalCost?locationIds=1&workerIds=1 expects
[
    {
        "location_id": 1,
        "location_name": "Office A",
        "total_cost": "25.83"
    }
]
13. http://localhost:3000/locations/totalCost?locationIds=1&workerIds=1&isComplete=true expects
[
    {
        "location_id": 1,
        "location_name": "Office A",
        "total_cost": "15.50"
    }
]
14. http://localhost:3000/locations/totalCost?workerIds=1 expects exception in logs 'cannot search by location without location ids please retry'
15. http://localhost:3000/locations/totalCost?locationids=-1 expects exception in logs 'location id is invalid please use a non negative number. Location Ids -1'