
db = db.getSiblingDB("admin");
db.system.users.find().forEach(function(user) {
    user.roles.forEach(function(role) {
        if (/write|admin/i.test(role.role)) {
            print(user.user + " " + user.db + " " + tojson(role));
        }
    })
});
