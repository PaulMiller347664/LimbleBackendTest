import {expect} from 'chai'
import { ValidateAndSetInputs } from '../index.js';
import { groupByEnum } from '../enums/groupByEnums.js';

describe('ValidateAndSetInputs', () => {
  it('should throw an error if both workerIds and locationIds are undefined', () => {
    const req = { query: {} };
    expect(() => ValidateAndSetInputs(req, null, null, groupByEnum.WORKER)).to.throw('location and workers cannot both be null');
  });

  it('should throw an error if locationIds are undefined and groupBy is LOCATION', () => {
    const req = { query: { workerIds: '1,2,3'} };
    expect(() => ValidateAndSetInputs(req, null, null, groupByEnum.LOCATION)).to.throw('cannot search by location without location ids please retry');
  });

  it('should throw an error if workerIds are undefined and groupBy is WORKER', () => {
    const req = { query: { locationIds: '1,2,3'} };
    expect(() => ValidateAndSetInputs(req, null, null, groupByEnum.WORKER)).to.throw('cannot search by workers without worker ids please retry');
  });

  it('should throw an error if any workerId is negative', () => {
    const req = { query: { workerIds: '-1,2,3' } };
    expect(() => ValidateAndSetInputs(req, null, null, groupByEnum.WORKER)).to.throw('Worker id is invalid please use a non negative number. Worker Ids -1,2,3');
  });

  it('should throw an error if any locationId is negative', () => {
    const req = { query: { locationIds: '-1,2,3' } };
    expect(() => ValidateAndSetInputs(req, null, null, groupByEnum.LOCATION)).to.throw('location id is invalid please use a non negative number. Location Ids -1,2,3');
  });

  it('should return isComplete, worker_ids, and location_ids', () => {
    const req = { query: { workerIds: '1,2', locationIds: '3,4', isComplete: 'true' } };
    const result = ValidateAndSetInputs(req, null, null, groupByEnum.LOCATION);
    expect(result.isComplete).to.equal(true);
    expect(result.worker_ids).to.deep.equal([1, 2]);
    expect(result.location_ids).to.deep.equal([3, 4]);
  });
});
