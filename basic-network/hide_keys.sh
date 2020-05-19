#!/bin/bash

#  GitLab prevents any .pem files from being published
#  However, the keys used in this example are for testing purposes only
#  and do not contain any personal or otherwise confidential information

#  To get around this restriction, the .pem extentions are changed to .txt
#  This can be done by running the `hide_keys.sh` script.

#  The `init_keys.sh` script will convert these files back
#  The .txt extensions will be switched back to .pem

#  Do not use this technique if the .pem files contain any information
#  that is actually confidential.


mv crypto-config/ordererOrganizations/example.com/ca/ca.example.com-cert.pem crypto-config/ordererOrganizations/example.com/ca/ca.example.com-cert.txt
mv crypto-config/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem crypto-config/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.txt
mv crypto-config/peerOrganizations/org1.example.com/ca/org1.example.com-cert.pem crypto-config/peerOrganizations/org1.example.com/ca/org1.example.com-cert.txt
