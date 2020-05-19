# Hyperledger Fabric Smoke Test

The purpose of this repo is to test the basic set up, connectivity, and functionality of a Fabric network with CouchDB. Chaincode is written in Node.js.

In this example, we will create a 'patient' and add it to the ledger. In this case, a patient only needs an ID, name, and age.

# Run this example locally

Clone the repo, then enter the project directory.

`git clone https://github.com/fabric-smoke-test`

`cd fabric-smoke-test`

The commands below will take you through the following steps.

- Launch a local network
- Install and instantiate chaincode
- Add a 'patient' to the ledger
- Query the ledger for the patient that was added
- Remove the patient from the ledger
- Stop and clean up the network

## 1. Initialize the network

`cd basic-network`

`./start.sh`

The `start.sh` script uses docker-compose to launch a basic network with 3 nodes: one CA, one orderer, and one peer.
It creates a channel named `mychannel`, then joins the peer node to the channel.

Note: You will be prompted to enter your password to run the script.

If you run `docker ps`, you should see that 5 containers have been created.

```
CONTAINER ID        IMAGE                        COMMAND                  CREATED             STATUS              PORTS                                        NAMES
d3b0c56a7b6c        hyperledger/fabric-tools     "/bin/bash"              36 seconds ago      Up 36 seconds                                                    cli
c31231c903cb        hyperledger/fabric-peer      "peer node start --p…"   48 seconds ago      Up 47 seconds       0.0.0.0:7051-7053->7051-7053/tcp             peer0.org1.example.com
d4e27523a0b3        hyperledger/fabric-orderer   "orderer"                48 seconds ago      Up 48 seconds       0.0.0.0:7050->7050/tcp                       orderer.example.com
d1019d8c1087        hyperledger/fabric-couchdb   "tini -- /docker-ent…"   48 seconds ago      Up 48 seconds       4369/tcp, 9100/tcp, 0.0.0.0:5984->5984/tcp   couchdb
6b3245817ab6        hyperledger/fabric-ca        "sh -c 'fabric-ca-se…"   48 seconds ago      Up 48 seconds       0.0.0.0:7054->7054/tcp                       ca.example.com
```

## 2. Enter the docker container

`docker exec -it cli bash`

## 3. Install chaincode on the node (this one might take a minute)

`peer chaincode install -n mycc -v 1.0 -p "/opt/gopath/src/github.com/newcc" -l "node"`

Expected output:

```
2020-05-19 00:20:57.758 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 001 Using default escc
2020-05-19 00:20:57.758 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 002 Using default vscc
2020-05-19 00:20:57.803 UTC [chaincodeCmd] submitInstallProposal -> INFO 003 Installed remotely: response:<status:200 payload:"OK" >
```

## 4. Instantiate the chaincode

`peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n mycc -l "node" -v 1.0 -c '{"Args":[]}'`

Expected output:

```
2020-05-19 00:21:04.260 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 001 Using default escc
2020-05-19 00:21:04.261 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 002 Using default vscc
```

## 5. Add a patient to the ledger

We're going to create a patient with the following information:

- patientID: p1
- patientName: Alice
- patientAge: 84

`peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n mycc -c '{"function":"addPatient","Args":["p1","Alice","84"]}'`

Here, we're _invoking_ the `addPatient` function on the chaincode and passing in _patientID_, _name_, and _age_.

The following flags are used to provide additional information for the command.

```
-o ---- Ordering service endpoint

-C ---- The channel on which this command should be executed

-n ---- Name of the chaincode

-c ---- Constructor message for the chaincode in JSON format

```

Expected output:

```
2020-05-19 00:21:10.593 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
```

## 6. Query the ledger to verify that the patient was added

`peer chaincode query -o orderer.example.com:7050 -C mychannel -n mycc -c '{"function":"queryPatients","Args":["p1"]}'`

Here, we're _querying_ the ledger, calling `queryPatients` and passing in the _patientID_.

We should see the response:

```
{"age":"84","name":"Alice","patientId":"p1"}
```

## 7. Delete the patient from the ledger

`peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n mycc -c '{"function":"deletePatient","Args":["p1"]}'`

Expected output:

```
2020-05-19 00:21:22.181 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
```

## 8. Ensure that the patient has been deleted

`peer chaincode query -o orderer.example.com:7050 -C mychannel -n mycc -c '{"function":"queryPatients","Args":["p1"]}'`

When we re-run the _query_ command from step 6, you should see that the patient we added in step 5 is no longer there.

We should see the response:

```
Error: endorsement failure during query. response: status:500 message:"error in simulation: transaction returned with failure: Error: Patient with this Id does not exist
```

## 9. Exit the container

`exit`

## 10. Stop the docker container and clean up

`./teardown.sh`

Note: If you get an error saying "You cannot remove a running container...", run `docker-compose -f docker-compose.yml stop` then try to teardown again.

Verify that all containers have been cleaned up by running `docker ps`
