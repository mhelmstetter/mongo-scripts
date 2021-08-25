
const excludedUsers = [ "mms-backup-agent", "svc_qa_auto", "svc_automation_qa", "pf_mongo_admin" ]

db = db.getSiblingDB("admin");
db.system.users.find().forEach(function(user) {
    if (excludedUsers.includes(user.user)) {
        print(user.user + " excluded");
    } else {
        user.roles.forEach(function(role) {
            var udb =  db.getSiblingDB(user.db);
            if (/write/i.test(role.role)) {
                udb.revokeRolesFromUser( user.user, [ role ]);
                if (role.role == "readWriteAnyDatabase") {
                    udb.grantRolesToUser(user.user, ["readAnyDatabase"]);
                } else if (role.role == "readWrite") {
                    udb.grantRolesToUser(user.user, ["read"]);
                } else {
                    print("*** UNHANDLED: " + user.user + " " + user.db + " " + tojson(role.role));
                }
            } else if  (/admin/i.test(role.role)) {
                print("revoking admin: " + user.user + " " + user.db + " " + tojson(role.role));
                udb.revokeRolesFromUser( user.user, [ role ]);
            }
        })
    }
});