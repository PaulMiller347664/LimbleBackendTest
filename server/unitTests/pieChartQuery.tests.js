import {expect} from 'chai'
import sinon from 'sinon'
import { getTotalCostOfWorkerOrLocation } from '../pieChartSearcher/pieChartQuery.js';
import { groupByEnum } from '../enums/groupByEnums.js';

describe('getTotalCostOfWorkerOrLocation', () => {
  it('should calculate total cost for workers', async () => {

    const connection = {
      query: sinon.stub().resolves([{ total_cost: 100 }]) 
    };

    const result = await getTotalCostOfWorkerOrLocation(connection, [1, 2], null, groupByEnum.WORKER, true);

    expect(result).to.be.an('array');
    expect(result[0].total_cost).to.equal(100); 
  });

});

describe('getTotalCostOfWorkerOrLocation', () => {
    it('should calculate total cost for workers', async () => {
  
      const connection = {
        query: sinon.stub().resolves([{ total_cost: 100 }]) 
      };
  
      const result = await getTotalCostOfWorkerOrLocation(connection, null, [1, 2], groupByEnum.LOCATION, true);
  
      expect(result).to.be.an('array');
      expect(result[0].total_cost).to.equal(100); 
    });
  
  });
