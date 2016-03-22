#!/bin/bash


echo -n "Enter MongoDB hostname of any replica member: "

read host

primary=`mongo --quiet --host $host <<EOF
db.isMaster().primary
EOF`

if [ "$?" -ne "0" ]; then
  echo "Unable to connect to host $host" 
  exit 1
fi

if [ -z "$primary" ]; then
  echo "No primary found, exiting" 
  exit 1
fi

echo "Primary is $primary"

echo -n "Enter admin user name: "

read adminUser

echo -n "Enter password for user $adminUser: "

read adminPassword



checkAdminLogin=`mongo --quiet --host $host -u $adminUser -p $adminPassword --authenticationDatabase admin <<EOF
db.isMaster()
EOF`

if [ "$?" -ne "0" ]; then
  echo "Unable to connect and/or authenticate to host $host" 
  exit 1
fi


echo -n "Enter database name: "

read dbName

echo -n "Enter role name: "

read roleName

echo -n "Enter user name: "

read userName

echo -n "Enter password for user $userName: "

read userPassword

create=`mongo --quiet --host $host -u $adminUser -p $adminPassword --authenticationDatabase admin <<EOF
use $dbName
db.createRole(
   {
     role: '$roleName',
     privileges: [
       { resource: { db: '$dbName', collection: '' }, 
          actions: [ 'insert', 'remove', 'update'] }
     ],
     roles: ['read']
   }
)
db.createUser({ user: '$userName', pwd: '$userPassword', roles: ['$roleName']})
EOF`

echo $create

echo -n "Enter one or more collection names to create (separated by space): "

read collNames

for coll in $collNames; do
   createCollections="$createCollections db.createCollection(\"$coll\");"
done

create=`mongo --quiet --host $host -u $userName -p $userPassword --authenticationDatabase $dbName <<EOF
use $dbName
$createCollections
show collections
EOF`




