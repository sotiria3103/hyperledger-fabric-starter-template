# hyperledger-fabric-starter-template
#### make sure the network is down before starting and no docker containers are up
> ./network.sh down

#### set up network with Certificate Authorities and create channel named "mychannel"
> ./network.sh up createChannel -c mychannel -ca

#### deploy chaincode named "trapezePolicy"
> ./network.sh deployCC -ccn trapezePolicy -ccl javascript

#### Environment variables for Org1
> export FABRIC_CFG_PATH=$PWD/config/   

> export CORE_PEER_TLS_ENABLED=true

> export CORE_PEER_LOCALMSPID="Org1MSP"

> export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt

> export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp

> export CORE_PEER_ADDRESS=localhost:7051

#### Run api 
> cd policy-chaincode/application-javascript/

> node clean_wallet.js

> node api.js

###---- f o r  m o n g o ----
#### check status
 > sudo service mongodb status
#### if "fail", run
 > sudo service mongodb start
