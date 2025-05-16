const Orphanage = require("./orphanage");
const OrphanageHelpRequest = require("./orphanageHelpRequest");
const Orphan = require("./orphan");
const User = require("./user");
const Sponsorship = require("./sponsorship");

//Orphanage.hasMany(orphan, { foreignKey: "orphanageId" });
//orphan.belongsTo(Orphanage, { foreignKey: "orphanageId" });

Orphanage.hasMany(OrphanageHelpRequest, { foreignKey: "orphanageId" });
OrphanageHelpRequest.belongsTo(Orphanage, { foreignKey: "orphanageId" });

Orphanage.hasMany(Orphan, { foreignKey: "orphanageId", onDelete: 'CASCADE' });
Orphan.belongsTo(Orphanage, { foreignKey: "orphanageId" });

User.hasMany(Sponsorship, { foreignKey: "sponsorId", onDelete: 'CASCADE' });
Sponsorship.belongsTo(User, { foreignKey: "sponsorId" });

Orphan.hasMany(Sponsorship, { foreignKey: "orphanId", onDelete: 'CASCADE' });
Sponsorship.belongsTo(Orphan, { foreignKey: "orphanId" });

const models = {
    Orphanage,
    OrphanageHelpRequest,
    Orphan,
    User,
    Sponsorship
}

module.exports = models;