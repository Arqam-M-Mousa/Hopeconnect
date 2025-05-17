const Orphanage = require("./orphanages");
const OrphanageHelpRequest = require("./orphanageHelpRequests");
const Orphan = require("./orphans");
const User = require("./users");
const Sponsorship = require("./sponsorships");
const Volunteer = require("./volunteers");
const VolunteerHelpRequest = require("./volunteerHelpRequests");

Orphanage.hasMany(OrphanageHelpRequest, {foreignKey: "orphanageId"});
OrphanageHelpRequest.belongsTo(Orphanage, {foreignKey: "orphanageId"});

Orphanage.hasMany(Orphan, {foreignKey: "orphanageId", onDelete: 'CASCADE'});
Orphan.belongsTo(Orphanage, {foreignKey: "orphanageId"});

User.hasMany(Sponsorship, {foreignKey: "sponsorId", onDelete: 'CASCADE'});
Sponsorship.belongsTo(User, {foreignKey: "sponsorId"});

Orphan.hasMany(Sponsorship, {foreignKey: "orphanId", onDelete: 'CASCADE'});
Sponsorship.belongsTo(Orphan, {foreignKey: "orphanId"});

Volunteer.belongsToMany(OrphanageHelpRequest, {
    through: VolunteerHelpRequest,
    foreignKey: 'volunteerId',
    otherKey: 'helpRequestId'
});

OrphanageHelpRequest.belongsToMany(Volunteer, {
    through: VolunteerHelpRequest,
    foreignKey: 'helpRequestId',
    otherKey: 'volunteerId'
});





const models = {
    Orphanage, OrphanageHelpRequest, Orphan, User, Sponsorship, Volunteer, VolunteerHelpRequest
}

module.exports = models;