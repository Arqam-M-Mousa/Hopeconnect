# Database Models

HopeConnect uses Sequelize as an ORM (Object-Relational Mapping) to interact with the MySQL database. This page documents the main database models and their relationships.

## Model Relationships

The following diagram illustrates the relationships between the main models in the HopeConnect application:

```
User
 ├── Volunteer
 ├── Donation
 ├── Sponsorship
 └── Review

Orphanage
 ├── Orphan
 ├── OrphanageHelpRequest
 ├── Review
 └── OrphanagePartnership

Orphan
 └── Sponsorship

Partnership
 └── OrphanagePartnership

Donation
 ├── DonationsTracking
 └── DeliveryTracking

Campaign
 └── Donation
```

## User Model

The User model represents users of the HopeConnect platform, including donors, volunteers, and administrators.

```javascript
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'donor', 'volunteer'),
    defaultValue: 'donor'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true
  }
});
```

## Orphan Model

The Orphan model represents children in orphanages who can be sponsored.

```javascript
const Orphan = sequelize.define('Orphan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: false
  },
  educationStatus: {
    type: DataTypes.STRING,
    allowNull: true
  },
  healthCondition: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  background: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  orphanageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orphanages',
      key: 'id'
    }
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isAvailableForSponsorship: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});
```

## Orphanage Model

The Orphanage model represents orphanages registered on the platform.

```javascript
const Orphanage = sequelize.define('Orphanage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactPerson: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
});
```

## Sponsorship Model

The Sponsorship model represents the relationship between a donor (sponsor) and an orphan.

```javascript
const Sponsorship = sequelize.define('Sponsorship', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sponsorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  orphanId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orphans',
      key: 'id'
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  frequency: {
    type: DataTypes.ENUM('monthly', 'quarterly', 'yearly', 'one-time'),
    defaultValue: 'monthly'
  },
  status: {
    type: DataTypes.ENUM('active', 'paused', 'ended'),
    defaultValue: 'active'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});
```

## Volunteer Model

The Volunteer model represents users who have registered as volunteers.

```javascript
const Volunteer = sequelize.define('Volunteer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  servicesOffered: {
    type: DataTypes.JSON,
    allowNull: true
  },
  availability: {
    type: DataTypes.STRING,
    allowNull: true
  },
  preferredLocation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  skills: {
    type: DataTypes.STRING,
    allowNull: true
  },
  experience: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});
```

## Donation Model

The Donation model represents donations made by users to orphanages.

```javascript
const Donation = sequelize.define('Donation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('general-funds', 'education', 'medical', 'emergency'),
    defaultValue: 'general-funds'
  },
  donationType: {
    type: DataTypes.ENUM('money', 'clothes', 'food', 'educational', 'other'),
    defaultValue: 'money'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  donorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  orphanageId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Orphanages',
      key: 'id'
    }
  },
  sponsorshipId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Sponsorships',
      key: 'id'
    }
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  campaignId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  transactionFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  netAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
});
```

## Review Model

The Review model represents user reviews of orphanages.

```javascript
const Review = sequelize.define('reviews', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  orphanageId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 500]
    }
  }
}, {
  timestamps: true
});
```

## DeliveryTracking Model

The DeliveryTracking model represents tracking information for physical donations.

```javascript
const DeliveryTracking = sequelize.define('deliveriesTracking', {
  id: {
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true
  }, 
  donationId: {
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: {
      model: 'donations', 
      key: 'id'
    }
  }, 
  status: {
    type: DataTypes.ENUM,
    values: ['PENDING', 'ASSIGNED', 'PICKUP_IN_PROGRESS', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
    defaultValue: 'PENDING'
  }, 
  pickupAddress: {
    type: DataTypes.STRING, 
    allowNull: false
  }, 
  deliveryAddress: {
    type: DataTypes.STRING, 
    allowNull: false
  }, 
  pickupDate: {
    type: DataTypes.DATE, 
    allowNull: false
  }, 
  deliveryDate: {
    type: DataTypes.DATE, 
    allowNull: true
  }, 
  currentLocation: {
    type: DataTypes.STRING, 
    allowNull: true
  }
}, {
  timestamps: true
});
```

## DonationsTracking Model

The DonationsTracking model represents updates and status changes for donations.

```javascript
const DonationsTracking = sequelize.define('donationsTracking', {
  id: {
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true
  }, 
  donationId: {
    type: DataTypes.INTEGER, 
    allowNull: false
  }, 
  status: {
    type: DataTypes.ENUM('pending', 'received', 'processing', 'shipped', 'completed', 'thanked'),
    allowNull: false
  }, 
  title: {
    type: DataTypes.STRING, 
    allowNull: false
  }, 
  description: {
    type: DataTypes.TEXT, 
    allowNull: false
  }, 
  imageUrl: {
    type: DataTypes.STRING
  }, 
  isRead: {
    type: DataTypes.BOOLEAN, 
    defaultValue: false
  }, 
  createdBy: {
    type: DataTypes.INTEGER, 
    allowNull: false
  }
}, {
  timestamps: true,
  paranoid: true,
});
```

## OrphanageHelpRequest Model

The OrphanageHelpRequest model represents requests for assistance from orphanages.

```javascript
const OrphanageHelpRequest = sequelize.define('orphanageHelpRequests', {
  id: {
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true
  }, 
  title: {
    type: DataTypes.STRING, 
    allowNull: false, 
    validate: {
      len: [5, 150]
    }
  }, 
  description: {
    type: DataTypes.TEXT, 
    allowNull: false
  }, 
  requestType: {
    type: DataTypes.ENUM('medical', 'educational', 'maintenance', 'supplies', 'other'), 
    allowNull: false
  }, 
  urgencyLevel: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'), 
    defaultValue: 'medium'
  }, 
  requiredSkills: {
    type: DataTypes.TEXT
  }, 
  startDate: {
    type: DataTypes.DATE
  }, 
  endDate: {
    type: DataTypes.DATE
  }, 
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'completed', 'cancelled'), 
    defaultValue: 'open'
  }, 
  orphanageId: {
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: {
      model: 'orphanages', 
      key: 'id'
    }
  }
}, {
  timestamps: true
});
```

## Partnership Model

The Partnership model represents organizations partnering with HopeConnect.

```javascript
const Partnership = sequelize.define('partnerships', {
  id: {
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING, 
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('NGO', 'charity', 'humanitarian'), 
    allowNull: false
  },
  contactEmail: {
    type: DataTypes.STRING, 
    allowNull: false, 
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING, 
    allowNull: true
  },
  address: {
    type: DataTypes.STRING, 
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT, 
    allowNull: true
  }
}, {
  timestamps: true
});
```

## OrphanagePartnership Model

The OrphanagePartnership model represents the relationship between orphanages and partners.

```javascript
const OrphanagePartnership = sequelize.define('orphanages_partnerships', {
  id: {
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true
  }, 
  orphanageId: {
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: {
      model: 'orphanages', 
      key: 'id'
    }
  }, 
  partnerId: {
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: {
      model: 'partner', 
      key: 'id'
    }
  }, 
  partnershipStatus: {
    type: DataTypes.ENUM('active', 'pending', 'inactive'), 
    defaultValue: 'pending'
  }
}, {
  timestamps: true
});
```

## VolunteerHelpRequest Model

The VolunteerHelpRequest model represents applications from volunteers for help requests.

```javascript
const VolunteerHelpRequest = sequelize.define('volunteers_orphanageHelpRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  volunteerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'volunteers',
      key: 'id'
    }
  },
  helpRequestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orphanageHelpRequests',
      key: 'id'
    }
  },
  appliedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
});
```

## Campaign Model

The Campaign model represents fundraising campaigns for orphanages.

```javascript
const Campaign = sequelize.define('campaigns', {
  id: {
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING, 
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  goalAmount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  currentAmount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  isEmergency: {
    type: DataTypes.BOOLEAN, 
    defaultValue: false
  }
});
```

## Model Associations

Sequelize associations are defined to establish relationships between models:

```javascript
// User associations
User.hasMany(Donation, { foreignKey: 'donorId' });
User.hasMany(Sponsorship, { foreignKey: 'sponsorId' });
User.hasOne(Volunteer, { foreignKey: 'userId' });
User.hasMany(Review, { foreignKey: 'userId' });

// Orphanage associations
Orphanage.hasMany(Orphan, { foreignKey: 'orphanageId' });
Orphanage.hasMany(Review, { foreignKey: 'orphanageId' });
Orphanage.hasMany(Donation, { foreignKey: 'orphanageId' });
Orphanage.hasMany(OrphanageHelpRequest, { foreignKey: 'orphanageId' });
Orphanage.belongsToMany(Partnership, { through: OrphanagePartnership, foreignKey: 'orphanageId' });

// Orphan associations
Orphan.belongsTo(Orphanage, { foreignKey: 'orphanageId' });
Orphan.hasMany(Sponsorship, { foreignKey: 'orphanId' });

// Donation associations
Donation.belongsTo(User, { foreignKey: 'donorId' });
Donation.belongsTo(Orphanage, { foreignKey: 'orphanageId' });
Donation.belongsTo(Sponsorship, { foreignKey: 'sponsorshipId' });
Donation.hasMany(DonationsTracking, { foreignKey: 'donationId' });
Donation.hasOne(DeliveryTracking, { foreignKey: 'donationId' });

// Volunteer associations
Volunteer.belongsTo(User, { foreignKey: 'userId' });
Volunteer.hasMany(VolunteerHelpRequest, { foreignKey: 'volunteerId' });

// Partnership associations
Partnership.belongsToMany(Orphanage, { through: OrphanagePartnership, foreignKey: 'partnerId' });
```
