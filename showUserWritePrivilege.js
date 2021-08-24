
db = db.getSiblingDB("admin");
db.system.users.find().forEach(function(user) {
    user.roles.forEach(function(role) {
        if (/write/i.test(role.role)) {
            //printjson(role);
            print(user.user + " " + user.db + " " + tojson(role));
            //var udb =  db.getSiblingDB(user.db);
            //udb.revokeRolesFromUser( user.user, [ role ]);
        }
    })
    //printjson(user);
});
