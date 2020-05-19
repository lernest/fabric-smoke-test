/*
 * A simple smart contract to test the basic funcionality of a fabric network.
 *
 * The network configuration can be found in the `basic-network` directory.
 *
 * This network is configured with CouchDB, which enables us to query the
 * data using rich query language, much like a typical SQL database.
 *
 * CouchDB stores the currect state of the ledger, while the underlying
 * blockchain maintains an immutable record of the history.
 *
 * This means we can remove data from the current state, but the removal
 * will remain visible on the blockchain.
 */

'use strict'

const { Contract } = require('fabric-contract-api')

class testContract extends Contract {
  /*
   * Add a new patient to the ledger
   */
  async addPatient(ctx, patientId, name, age) {
    // Minimal example of a patient
    let patient = {
      patientId,
      name,
      age,
    }

    await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(patient)))

    console.log('Patient successfully added to the ledger. ', patient)
  }

  /*
   * Query the ledger to search for a patient by patientId
   */
  async queryPatients(ctx, patientId) {
    console.log('Querying the ledger for patientId:', patientId)
    let patientAsBytes = await ctx.stub.getState(patientId)
    if (!patientAsBytes || patientAsBytes.toString().length <= 0) {
      throw new Error(
        'Patient containing this patientId does not exist: ',
        patientId
      )
    }
    let patient = JSON.parse(patientAsBytes.toString())

    return JSON.stringify(patient)
  }

  /*
   * Delete a patient on the ledger, by patientID
   */
  async deletePatient(ctx, patientId) {
    await ctx.stub.deleteState(patientId)

    console.log('Patient deleted from the ledger Succesfully..')
  }
}

module.exports = testContract
