db = db.getSiblingDB("test");
var admin = db.getSiblingDB("admin")
db.users.find().forEach(function(user) {
    var existing = db.getSiblingDB("admin").getCollection("system.users").findOne({"user": user.user, "db":user.db});
    var udb =  db.getSiblingDB(user.db);
    if (existing == null) {
        udb.createUser({"user": user.user, "pwd": "password123", roles: []});
    }
    udb.grantRolesToUser(user.user, user.roles);
});