
const excludedUsers = [ "mms-backup-agent", "reportsUser" ]

db = db.getSiblingDB("admin");
db.system.users.find().forEach(function(user) {
    if (excludedUsers.includes(user.user)) {
        print(user.user + " excluded");
    } else {
        user.roles.forEach(function(role) {
            if (/write/i.test(role.role)) {
                var udb =  db.getSiblingDB(user.db);
                udb.revokeRolesFromUser( user.user, [ role ]);
                if (role.role == "readWriteAnyDatabase") {
                    udb.grantRolesToUser(user.user, ["readAnyDatabase"]);
                } else if (role.role == "readWrite") {
                    udb.grantRolesToUser(user.user, ["read"]);
                } else {
                    print("*** UNHANDLED: " + user.user + " " + user.db + " " + tojson(role.role));
                }
            }
        })
    }
});