const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const fs = require('fs');

// Load the base YAML file
const basePath = path.join(__dirname, '../docs/base.yaml');
const baseYaml = YAML.load(basePath);

// Load and inline the user.yaml file
const userPath = path.join(__dirname, '../docs/paths/user.yaml');
const userYaml = YAML.load(userPath);

// Load and inline the volunteer.yaml file
const volunteerPath = path.join(__dirname, '../docs/paths/volunteer.yaml');
const volunteerYaml = YAML.load(volunteerPath);

// Load and inline the sponsorship.yaml file
const sponsorshipPath = path.join(__dirname, '../docs/paths/sponsorship.yaml');
const sponsorshipYaml = YAML.load(sponsorshipPath);

// Load and inline the orphan.yaml file
const orphanPath = path.join(__dirname, '../docs/paths/orphan.yaml');
const orphanYaml = YAML.load(orphanPath);

// Load and inline the orphanage.yaml file
const orphanagePath = path.join(__dirname, '../docs/paths/orphanage.yaml');
const orphanageYaml = YAML.load(orphanagePath);

// Load and inline the donation.yaml file
const donationPath = path.join(__dirname, '../docs/paths/donation.yaml');
const donationYaml = YAML.load(donationPath);

// Load and inline the review.yaml file
const reviewPath = path.join(__dirname, '../docs/paths/review.yaml');
const reviewYaml = YAML.load(reviewPath);

// Load and inline the deliveryTracking.yaml file
const deliveryTrackingPath = path.join(__dirname, '../docs/paths/deliveryTracking.yaml');
const deliveryTrackingYaml = YAML.load(deliveryTrackingPath);

// Load and inline the partnership.yaml file
const partnershipPath = path.join(__dirname, '../docs/paths/partnership.yaml');
const partnershipYaml = YAML.load(partnershipPath);

// Merge the paths into the base paths
baseYaml.paths = {
    // User endpoints
    '/user/register': userYaml['/register'],
    '/user/login': userYaml['/login'],
    '/user/me': userYaml['/me'],
    '/user/{id}': userYaml['/{id}'],
    '/user': userYaml['/'],

    // Volunteer endpoints
    '/volunteer/search': volunteerYaml['/search'],
    '/volunteer/me': volunteerYaml['/me'],
    '/volunteer/me/applications': volunteerYaml['/me/applications'],
    '/volunteer/{id}': volunteerYaml['/{id}'],
    '/volunteer/{id}/verify': volunteerYaml['/{id}/verify'],
    '/volunteer/{id}/apply': volunteerYaml['/{id}/apply'],
    '/volunteer/{id}/applications/{applicationId}': volunteerYaml['/{id}/applications/{applicationId}'],
    '/volunteer/{id}/matches': volunteerYaml['/{id}/matches'],
    '/volunteer': volunteerYaml['/'],

    // Sponsorship endpoints
    '/sponsorship/{id}': sponsorshipYaml['/{id}'],
    '/sponsorship': sponsorshipYaml['/'],

    // Orphan endpoints
    '/orphan/sponsorships': orphanYaml['/sponsorships'],
    '/orphan/{id}': orphanYaml['/{id}'],
    '/orphan': orphanYaml['/'],

    // Orphanage endpoints
    '/orphanage/statistics': orphanageYaml['/statistics'],
    '/orphanage/help-requests': orphanageYaml['/help-requests'],
    '/orphanage/{id}': orphanageYaml['/{id}'],
    '/orphanage/{id}/help-requests': orphanageYaml['/{id}/help-requests'],
    '/orphanage/{id}/help-requests/{requestId}': orphanageYaml['/{id}/help-requests/{requestId}'],
    '/orphanage': orphanageYaml['/'],

    // Donation endpoints
    '/donation/updates': donationYaml['/updates'],
    '/donation/updates/{id}': donationYaml['/updates/{id}'],
    '/donation/{id}': donationYaml['/{id}'],
    '/donation/{id}/updates': donationYaml['/{id}/updates'],
    '/donation/{id}/updates/{updateId}': donationYaml['/{id}/updates/{updateId}'],
    '/donation': donationYaml['/'],

    // Review endpoints
    '/review/{id}': reviewYaml['/{id}'],
    '/review': reviewYaml['/'],

    // DeliveryTracking endpoints
    '/deliveryTracking/{id}': deliveryTrackingYaml['/{id}'],
    '/deliveryTracking/{id}/location': deliveryTrackingYaml['/{id}/location'],
    '/deliveryTracking': deliveryTrackingYaml['/'],

    // Partnership endpoints
    '/partnership/{id}': partnershipYaml['/{id}'],
    '/partnership/{partnershipId}/orphanages': partnershipYaml['/{partnershipId}/orphanages'],
    '/partnership/{partnershipId}/orphanages/{orphanageId}': partnershipYaml['/{partnershipId}/orphanages/{orphanageId}'],
    '/partnership': partnershipYaml['/']
};

module.exports = {
    swaggerUi,
    specs: baseYaml,
};
