const Orphanage = require("./orphanages");
const OrphanageHelpRequest = require("./orphanageHelpRequests");
const Orphan = require("./orphans");
const User = require("./users");
const Sponsorship = require("./sponsorships");
const Volunteer = require("./volunteer");

Orphanage.hasMany(OrphanageHelpRequest, {foreignKey: "orphanageId"});
OrphanageHelpRequest.belongsTo(Orphanage, {foreignKey: "orphanageId"});

Orphanage.hasMany(Orphan, {foreignKey: "orphanageId", onDelete: 'CASCADE'});
Orphan.belongsTo(Orphanage, {foreignKey: "orphanageId"});

User.hasMany(Sponsorship, {foreignKey: "sponsorId", onDelete: 'CASCADE'});
Sponsorship.belongsTo(User, {foreignKey: "sponsorId"});

Orphan.hasMany(Sponsorship, {foreignKey: "orphanId", onDelete: 'CASCADE'});
Sponsorship.belongsTo(Orphan, {foreignKey: "orphanId"});




const models = {
    Orphanage, OrphanageHelpRequest, Orphan, User, Sponsorship, Volunteer,
}

module.exports = models;