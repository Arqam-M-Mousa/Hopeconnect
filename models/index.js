const Orphanage = require("./orphanages");
const OrphanageHelpRequest = require("./orphanageHelpRequests");
const Orphan = require("./orphans");
const User = require("./users");
const Sponsorship = require("./sponsorships");
const Volunteer = require("./volunteers");
const VolunteerHelpRequest = require("./volunteerHelpRequests");
const Donation = require("./donations");
const DonationsTracking = require("./donationsTracking");
const Review = require("./reviews");
const DeliveryTracking = require("./deliveryTracking");

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

Donation.hasMany(DonationsTracking, { foreignKey: 'donationId', onDelete: 'CASCADE' });
DonationsTracking.belongsTo(Donation, { foreignKey: 'donationId' });

Sponsorship.hasMany(Donation, { foreignKey: 'sponsorshipId', onDelete: 'SET NULL' });
Donation.belongsTo(Sponsorship, { foreignKey: 'sponsorshipId' });

User.hasMany(Review, {foreignKey: 'userId', onDelete: 'CASCADE'});
Review.belongsTo(User, {foreignKey: 'userId'});

Orphanage.hasMany(Review, {foreignKey: 'orphanageId', onDelete: 'CASCADE'});
Review.belongsTo(Orphanage, {foreignKey: 'orphanageId'});

Volunteer.belongsToMany(OrphanageHelpRequest, {
    through: 'volunteerHelpRequest',
    foreignKey: 'volunteerId',
    otherKey: 'helpRequestId'
});
OrphanageHelpRequest.belongsToMany(Volunteer, {
    through: 'volunteerHelpRequest',
    foreignKey: 'helpRequestId',
    otherKey: 'volunteerId'
});

Donation.hasMany(DeliveryTracking, { foreignKey: 'donationId', onDelete: 'CASCADE' });
DeliveryTracking.belongsTo(Donation, { foreignKey: 'donationId' });





const models = {
    Orphanage,
    OrphanageHelpRequest,
    Orphan,
    User,
    Sponsorship,
    Donation,
    DonationsTracking,
    Volunteer,
    VolunteerHelpRequest,
    Review,
    DeliveryTracking,
}

module.exports = models;