const Orphanage = require("./orphanages");
const OrphanageHelpRequest = require("./orphanageHelpRequests");
const Orphan = require("./orphans");
const User = require("./users");
const Sponsorship = require("./sponsorships");
const Donation = require("./donations");
const DonationTracking = require("./donationsTracking");

Orphanage.hasMany(OrphanageHelpRequest, {foreignKey: "orphanageId"});
OrphanageHelpRequest.belongsTo(Orphanage, {foreignKey: "orphanageId"});

Orphanage.hasMany(Orphan, {foreignKey: "orphanageId", onDelete: 'CASCADE'});
Orphan.belongsTo(Orphanage, {foreignKey: "orphanageId"});

User.hasMany(Sponsorship, {foreignKey: "sponsorId", onDelete: 'CASCADE'});
Sponsorship.belongsTo(User, {foreignKey: "sponsorId"});

Orphan.hasMany(Sponsorship, {foreignKey: "orphanId", onDelete: 'CASCADE'});
Sponsorship.belongsTo(Orphan, {foreignKey: "orphanId"});

User.hasMany(Donation, {foreignKey: "donorId", onDelete: 'CASCADE'});
Donation.belongsTo(User, {foreignKey: "donorId"});

Orphanage.hasMany(Donation, {foreignKey: "orphanageId", onDelete: 'CASCADE'});
Donation.belongsTo(Orphanage, {foreignKey: "orphanageId"});

Donation.hasMany(DonationTracking, {foreignKey: "donationId", onDelete: 'CASCADE'});
DonationTracking.belongsTo(Donation, {foreignKey: "donationId"});

const models = {
    Orphanage, OrphanageHelpRequest, Orphan, User, Sponsorship , Donation , DonationUpdate: DonationTracking
}

module.exports = models;