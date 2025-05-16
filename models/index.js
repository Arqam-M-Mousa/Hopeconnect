const Orphanage = require("./orphanage");
const OrphanageHelpRequest = require("./orphanageHelpRequest");

//Orphanage.hasMany(orphan, { foreignKey: "orphanageId" });
//orphan.belongsTo(Orphanage, { foreignKey: "orphanageId" });

Orphanage.hasMany(OrphanageHelpRequest, { foreignKey: "orphanageId" });
OrphanageHelpRequest.belongsTo(Orphanage, { foreignKey: "orphanageId" });

const models = {
    Orphanage,
    OrphanageHelpRequest,
}

module.exports = models;