import express from "express";
import * as mariadb from "mariadb";
import {buildTestData} from "./testCases/testData.js"
import {getTotalCostOfWorkerOrLocation} from "./pieChartSearcher/pieChartQuery.js"
import { groupByEnum } from "./enums/groupByEnums.js";
const app = express();
const port = 3000;
let pool;

async function getPool() {
  console.info("Connecting to DB...");
  pool = mariadb.createPool({
    host: process.env["DATABASE_HOST"],
    user: process.env["DATABASE_USER"],
    password: process.env["DATABASE_PASSWORD"],
    database: process.env["DATABASE_NAME"]
  });

}




async function main() {
  getPool();
  //populating test data. Only need to run once.
  let connection = await pool.getConnection();
  buildTestData(connection);
  await connection.end
  app.get("/workers/totalCost", async (req, res) => {
    let worker_ids = null;
    let location_ids = null;
    try
    {
      let isComplete;
      ({ isComplete, worker_ids, location_ids } = ValidateAndSetInputs(req, worker_ids, location_ids,groupByEnum.WORKER));
      let connection = await pool.getConnection();
      const result = await getTotalCostOfWorkerOrLocation(connection, worker_ids, location_ids, groupByEnum.WORKER, isComplete);
      if('code' in result)
      {
        res.status(result['code']).json(result['error'])
      }
      res.json(result);
      await connection.end
  }
  catch(exception)
  {
    //something unexpected throw a 500
    res.status(500).json(exception)
    console.error(exception);
  }
  });


  app.get("/locations/totalCost", async (req, res) => {
    let worker_ids = null;
    let location_ids = null;
    try
    {
      let isComplete;
      ({ isComplete, worker_ids, location_ids } = ValidateAndSetInputs(req, worker_ids, location_ids, groupByEnum.LOCATION));
      let connection = await pool.getConnection();
      const result = await getTotalCostOfWorkerOrLocation(connection, worker_ids, location_ids, groupByEnum.LOCATION, isComplete);
      if('code' in result)
      {
        res.status(result['code']).json(result['error'])
      }
      res.json(result);
      await connection.end
  }
  catch(exception)
  {
    //log an error, activate an alert, etc
    res.status(500).json(exception)
    console.error(exception);
  }
  });

  //test method used for testing verification, not in the final product
  app.get("/", async (res) => {
    let connection = await pool.getConnection();
    let query = `
        SELECT
            w.*, w.hourly_wage * (lt.time_seconds / 3600) AS total_cost, l.name, t.isComplete
        FROM
            workers w
        INNER JOIN
            logged_time lt ON w.id = lt.worker_id
        INNER JOIN
            tasks t ON lt.task_id = t.id
        INNER JOIN 
            locations l on t.location_id = l.id
        `
    let locations = await connection.query(query);
    res.json(locations);
    await connection.end
  });



  app.listen(port, "0.0.0.0", () => {
    console.info(`App listening on ${port}.`);
  });
}

await main();
export function ValidateAndSetInputs(req, worker_ids, location_ids, groupBy) {
  console.log(`validating worker ids and location ids`);
  
  if (req.query.locationIds === undefined && req.query.workerIds === undefined) {
    throw 'location and workers cannot both be null';
  }

  if(req.query.locationIds === undefined && groupBy == groupByEnum.LOCATION)
  {
    throw 'cannot search by location without location ids please retry'
  }

  if(req.query.workerIds === undefined && groupBy == groupByEnum.WORKER)
  {
    throw 'cannot search by workers without worker ids please retry'
  }


  if (req.query.workerIds !== undefined) {
    worker_ids = req.query.workerIds.split(',').map(id => parseInt(id));
    if(worker_ids.some(num => num < 0))
    {
      throw `Worker id is invalid please use a non negative number. Worker Ids ${worker_ids}`
    }
  }

  if (req.query.locationIds !== undefined) {
    location_ids = req.query.locationIds.split(',').map(id => parseInt(id));
    if(location_ids.some(num => num < 0))
    {
      throw `location id is invalid please use a non negative number. Location Ids ${location_ids}`
    }
  }

  let isComplete = null;

  if (req.query.isComplete !== undefined && req.query.isComplete !== null) {
    isComplete = req.query.isComplete === 'true';
  }
  console.log(`finished validating worker ids ${worker_ids} and location ids ${location_ids} and ${isComplete == null? 'tasks unfiltered' : `tasks filtered on complete === ${isComplete}`}`);
  return { isComplete, worker_ids, location_ids };
}

