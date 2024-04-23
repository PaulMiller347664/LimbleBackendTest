import { groupByEnum } from "../enums/groupByEnums.js";
export async function getTotalCostOfWorkerOrLocation(connection, worker_ids, location_ids, groupOn = groupByEnum.WORKER, is_complete = null)
{
    console.log(`calculating cost of ${groupOn == groupByEnum.WORKER? 'workers': 'locations'} for ids ${worker_ids}, at locations ${location_ids}, and tasks are ${is_complete == null? 'unfiltered': `filtered on tasks complete == ${is_complete} `}`);
    
    //these 3 variables go in the where clause of the variable
    let completionCondition = '';
    let workerCondition = '';
    let locationCondition = '';

    if(worker_ids !== null )
    {
        //if we are searching on workers, add this to the where clause
        workerCondition = `w.id in (${worker_ids})`
    }

    if(location_ids !== null )
    {
        //if we are searching on location, add this to the where clause
        locationCondition = `${worker_ids !== null? 'AND' : ''} l.id in (${location_ids})`
    }
    
    //filtering on whether tasks are complete. if no parameter is passed in, both will be queried
    if (is_complete === true) {
        completionCondition = 'AND t.isComplete = TRUE';
    } else if (is_complete === false) {
        completionCondition = 'AND t.isComplete = FALSE';
    }

    //changing what we select based off whether we are returning workers or locations total cost is always returned
    let selectStatement = groupOn === groupByEnum.WORKER? 'w.id as worker_id, w.userName as username' : 'l.id as location_id, l.name as location_name'

    let query = `
        SELECT
            ${selectStatement}, TRUNCATE(SUM(w.hourly_wage * (lt.time_seconds / 3600)), 2) AS total_cost 
        FROM
            workers w
        INNER JOIN
            logged_time lt ON w.id = lt.worker_id
        INNER JOIN
            tasks t ON lt.task_id = t.id
        INNER JOIN 
            locations l on t.location_id = l.id
        WHERE
            ${workerCondition} ${locationCondition} ${completionCondition}
        GROUP BY 
            ${groupOn === groupByEnum.WORKER? 'w.id': 'l.id'}
        `;
    
    const result = await connection.query(query);    

    if(result[0] === undefined)
    {
        //nothing was found based on the parameters
        throw `no worker(s) found for worker id(s) ${worker_ids} or location id(s) ${location_ids}`;
    }

    console.log(`total cost has been calculated for worker ids ${worker_ids} and location ids ${location_ids} using query ${query}`)
    return result;
     

    }