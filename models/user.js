const mongoose = require('../services/mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const uuid = require('uuid');
const TagLinkSchema = require('./schema/tag_link');
const TokenSchema = require('./schema/token');
const can = require('../perms');

// USER_ROLES is the array of roles that is permissible as a user role.
const USER_ROLES = require('./enum/user_roles');

// USER_STATUS_USERNAME is the list of statuses that are supported by storing
// the username state.
const USER_STATUS_USERNAME = require('./enum/user_status_username');

// ProfileSchema is the mongoose schema defined as the representation of a
// User's profile stored in MongoDB.
const ProfileSchema = new Schema({

  // ID provides the identifier for the user profile, in the case of a local
  // provider, the id would be an email, in the case of a social provider,
  // the id would be the foreign providers identifier.
  id: {
    type: String,
    required: true
  },

  // Provider is simply the name attached to the authentication mode. In the
  // case of a locally provided profile, this will simply be `local`, or a
  // social provider which for Facebook would just be `facebook`.
  provider: {
    type: String,
    required: true
  },

  // Metadata provides a place to put provider specific details. An example of
  // something that could be stored here is the `metadata.confirmed_at` could be
  // used by the `local` provider to indicate when the email address was
  // confirmed.
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  _id: false
});

// UserSchema is the mongoose schema defined as the representation of a User in
// MongoDB.
const UserSchema = new Schema({

  // This ID represents the most unique identifier for a user, it is generated
  // when the user is created as a random uuid.
  id: {
    type: String,
    default: uuid.v4,
    unique: true,
    required: true
  },

  // This is sourced from the social provider or set manually during user setup
  // and simply provides a name to display for the given user.
  username: {
    type: String,
    required: true
  },

  // TODO: find a way that we can instead utilize MongoDB 3.4's collation
  // options to build the index in a case insenstive manner:
  // https://docs.mongodb.com/manual/reference/collation/
  lowercaseUsername: {
    type: String,
    required: true,
    unique: true
  },

  // This provides a source of identity proof for users who login using the
  // local provider. A local provider will be assumed for users who do not
  // have any social profiles.
  password: String,

  // Profiles describes the array of identities for a given user. Any one user
  // can have multiple profiles associated with them, including multiple email
  // addresses.
  profiles: [ProfileSchema],

  // Tokens are the individual personal access tokens for a given user.
  tokens: [TokenSchema],

  // Role is the specific user role that the user holds.
  role: {
    type: String,
    enum: USER_ROLES,
    required: true,
    default: 'COMMENTER',
  },

  // Status stores the user status information regarding permissions,
  // capabilities and moderation state.
  status: {

    // Username stores the current user status for the username as well as the
    // history of changes.
    username: {

      // Status stores the current username status.
      status: {
        type: String,
        enum: USER_STATUS_USERNAME,
      },

      // History stores the history of username status changes.
      history: [{

        // Status stores the historical username status.
        status: {
          type: String,
          enum: USER_STATUS_USERNAME,
        },

        // assigned_by stores the user id of the user who assigned this status.
        assigned_by: {type: String, default: null},

        // created_at stores the date when this status was assigned.
        created_at: {type: Date, default: Date.now}
      }],
    },

    // Banned stores the current user banned status as well as the history of
    // changes.
    banned: {

      // Status stores the current user banned status.
      status: {
        type: Boolean,
        required: true,
        default: false,
      },
      history: [{

        // Status stores the historical banned status.
        status: Boolean,

        // assigned_by stores the user id of the user who assigned this status.
        assigned_by: {type: String, default: null},

        // message stores the email content sent to the user.
        message: {type: String, default: null},

        // created_at stores the date when this status was assigned.
        created_at: {type: Date, default: Date.now}
      }],
    },

    // Suspension stores the current user suspension status as well as the
    // history of changes.
    suspension: {

      // until is the date that the user is suspended until.
      until: {
        type: Date,
        default: null,
      },
      history: [{

        // until is the date that the user is suspended until.
        until: Date,

        // assigned_by stores the user id of the user who assigned this status.
        assigned_by: {type: String, default: null},

        // message stores the email content sent to the user.
        message: {type: String, default: null},

        // created_at stores the date when this status was assigned.
        created_at: {type: Date, default: Date.now}
      }]
    }
  },

  // IgnoresUsers is an array of user id's that the current user is ignoring.
  ignoresUsers: [String],

  // Counts to store related to actions taken on the given user.
  action_counts: {
    default: {},
    type: Object,
  },

  // Tags are added by the self or by administrators.
  tags: [TagLinkSchema],

  // Additional metadata stored on the field.
  metadata: {
    default: {},
    type: Object
  }
}, {

  // This will ensure that we have proper timestamps available on this model.
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },

  toJSON: {
    transform: function (doc, ret) {
      delete ret.password;
      delete ret._id;
      delete ret.__v;
    }
  }
});

// Add the index on the user profile data.
UserSchema.index({
  'profiles.id': 1,
  'profiles.provider': 1
}, {
  unique: true,
  background: false
});

/**
 * returns true if a commenter is staff
 */
UserSchema.method('isStaff', function () {
  return this.role !== 'COMMENTER';
});

/**
 * This verifies that a password is valid.
 */
UserSchema.method('verifyPassword', function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, res) => {
      if (err) {
        return reject(err);
      }

      if (!res) {
        return resolve(false);
      }

      return resolve(true);
    });
  });
});

/**
 * Can returns true if the user is allowed to perform a specific graph
 * operation.
 */
UserSchema.method('can', function(...actions) {
  return can(this, ...actions);
});

/**
 * banned returns true when the user is currently banned, and sets the banned
 * status locally.
 */
UserSchema.virtual('banned')
  .get(function() {
    return this.status.banned.status;
  })
  .set(function(status) {
    this.status.banned.status = status;
    this.status.banned.history.push({
      status,
      created_at: new Date()
    });
  });

/**
 * suspended returns true when the user is currently suspended, and sets the
 * suspension status locally.
 */
UserSchema.virtual('suspended')
  .get(function() {
    return Boolean(this.status.suspension.until && this.status.suspension.until > new Date());
  })
  .set(function(until) {
    this.status.suspension.until = until;
    this.status.suspension.history.push({
      until,
      created_at: new Date()
    });
  });

// Create the User model.
const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
