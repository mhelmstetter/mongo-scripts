#!/bin/bash

mongoadmin_pwd="changeme"
appdb_host2="ip-172-31-39-243.us-west-2.compute.internal:27018"
appdb_host3="ip-172-31-39-243.us-west-2.compute.internal:27019"

rs_init="rs.initiate()"  
create_mongoadmin="db.createUser({user:'mongoadmin',pwd:'$mongoadmin_pwd', roles: ['root']})"
create_omuser="db.createUser({user: 'opsmanager', pwd: 'CHANGEME', roles: [ 'readWriteAnyDatabase', 'dbAdminAnyDatabase', 'clusterMonitor']})"
rs_add_2="rs.add('$appdb_host2')"
rs_add_3="rs.add('$appdb_host3')"

mongocmd="mongo -u mongoadmin -p $mongoadmin_pwd admin"

echo $rs_init | mongo
sleep 5
echo $create_mongoadmin | mongo admin
echo $create_omuser | $mongocmd
echo $rs_add_2 | $mongocmd
sleep 5
echo $rs_add_3 | $mongocmd
