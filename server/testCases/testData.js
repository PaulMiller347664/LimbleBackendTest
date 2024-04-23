export function buildTestData(connection) {
   
    const locationData = [
        "('Office A')",
        "('Office B')",
        "('Warehouse')"
    ];

   
    const workerData = [
        "('john_doe', 15.50)",
        "('jane_smith', 18.75)",
        "('alex_jones', 20.00)"
    ];

  
    const taskData = [
        "('Inspect HVAC system', 1, TRUE)", //desc, location, complete
        "('Repair conveyor belt', 2, TRUE)",
        "('Calibrate sensors', 3, TRUE)",
        "('Replace light fixtures', 1, FALSE)",
        "('Test emergency alarms', 2, FALSE)"
    ];

   
    const loggedTimeData = [
        "(3600, 1, 1)",  //time, task, worker //location 1
        "(1800, 2, 2)",    //location 2
        "(2700, 3, 3)",   //location 3
        "(2400, 4, 1)",   //location 1
        "(3000, 5, 2)",    //location 2
        "(3600, 5, 1)" //location 2
    ];

    connection.query(
        `INSERT INTO locations (name) VALUES ${locationData.join(',')}`,
        (err, result) => {
            if (err) throw err;
            console.log('Inserted sample data into locations table');
        }
    );

    connection.query(
        `INSERT INTO workers (username, hourly_wage) VALUES ${workerData.join(',')}`,
        (err, result) => {
            if (err) throw err;
            console.log('Inserted sample data into workers table');
        }
    );

    connection.query(
        `INSERT INTO tasks (description, location_id, isComplete ) VALUES ${taskData.join(',')}`,
        (err, result) => {
            if (err) throw err;
            console.log('Inserted sample data into tasks table');
        }
    );

    connection.query(
        `INSERT INTO logged_time (time_seconds, task_id, worker_id) VALUES ${loggedTimeData.join(',')}`,
        (err, result) => {
            if (err) throw err;
            console.log('Inserted sample data into logged_time table');
        }
    );
}
