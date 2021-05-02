/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

const colors = ['blue', 'red', 'green', 'yellow', 'black', 'purple', 'white', 'violet', 'indigo', 'brown'];
const makes = ['Toyota', 'Ford', 'Hyundai', 'Volkswagen', 'Tesla', 'Peugeot', 'Chery', 'Fiat', 'Tata', 'Holden'];
const models = ['Prius', 'Mustang', 'Tucson', 'Passat', 'S', '205', 'S22L', 'Punto', 'Nano', 'Barina'];
const owners = ['Tomoko', 'Brad', 'Jin Soo', 'Max', 'Adrianna', 'Michel', 'Aarav', 'Pari', 'Valeria', 'Shotaro'];

/**
 * Database
 */
const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

/**
 * Hash
 */
const crypto = require('crypto');

/**
 * Workload module for the benchmark round.
 */
class CreateCarWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.txIndex = 1000;
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        try {
            await client.connect();

            const db = client.db('fabcar');
            const cars = db.collection('cars');

            this.txIndex++;
            const carNumber = 'Client' + this.workerIndex + '_CAR' + this.txIndex.toString();
    
            const carDocument = {
                _id: carNumber,
                color: colors[Math.floor(Math.random() * colors.length)],
                make: makes[Math.floor(Math.random() * makes.length)],
                model: models[Math.floor(Math.random() * models.length)],
                owner: owners[Math.floor(Math.random() * owners.length)]
            }

            const resInsert = await cars.insertOne(carDocument);
            const hash = crypto.createHash('md5').update(JSON.stringify(resInsert.ops[0])).digest('hex');

            const args = {
                contractId: 'fabcar-hash',
                contractVersion: 'v1',
                contractFunction: 'createCar',
                contractArguments: [carNumber, hash],
                timeout: 30
            };

            await this.sutAdapter.sendRequests(args);
        } catch(err) {
            console.error(err)
        } finally {
            // await client.close();
        }
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new CreateCarWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
