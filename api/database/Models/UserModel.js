
const bcrypt = require('bcryptjs');


module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            email:
            {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: {
                        msg: "Email is not valid"
                    },
                    notEmpty: {
                        msg: "Email address cannot be empty"
                    }
                }
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    len: {
                        args: [6, 255],
                        msg: "Password must have at least 6 characters"
                    },
                    notEmpty: {
                        msg: "Password cannot be empty"
                    }
                }
            },

            firstName: {
                type: DataTypes.STRING(255),
                allowNull: false,
                field: "first_name",
                validate: {
                    len: {
                        args: [2, 100],
                        msg: "Name must have at least 2 characters"
                    },
                    notEmpty: {
                        msg: "Name cannot be empty"
                    }
                }
            },
            lastName: {
                type: DataTypes.STRING(255),
                allowNull: false,
                field: "last_name",
                validate: {
                    len: {
                        args: [2, 100],
                        msg: "Last Name must have at least 2 characters"
                    },
                    notEmpty: {
                        msg: "Last Name cannot be empty"
                    }
                }
            },

            currency: {
                type: DataTypes.STRING(3),
                allowNull: false,
                defaultValue: "TRY",
                validate: {
                    isIn: {
                        args: [['TRY', 'USD', 'EUR', 'GBP']],
                        msg: 'Please select a valid currency'
                    }
                }
            },

            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                field: "is_active"
            },

            emailVerified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: "email_verified"
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
                field: 'created_at'
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
                field: 'updated_at'
            }



        },
        {
            tableName: "users",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            indexes: [
                {
                    unique: true,
                    fields: ["email"],
                    name: 'users_email_idx'
                },
                {
                    fields: ["is_active"],
                    name: "users_active_idx"
                }
            ],

            hooks: {

            }
        }
    );

    // Instance Methods
    User.prototype.checkPassword = async function (password) {
        return await bcrypt.compare(password, this.password);
    };

    User.prototype.getFullName = function () {
        return `${this.firstName} ${this.lastName}`;
    };

    User.prototype.toJSON = function () {
        const values = Object.assign({}, this.get());
        delete values.password; // Şifreyi response'dan çıkar
        return values;
    };

    // Class Methods
    User.findByEmail = async function (email) {
        return await this.findOne({
            where: { email: email.toLowerCase() }
        });
    };

    User.findActiveUsers = async function () {
        return await this.findAll({
            where: { isActive: true },
            attributes: { exclude: ['password'] }
        });
    };

    // Associations
    User.associate = function (models) {
        // User has many Categories
        User.hasMany(models.Category, {
            foreignKey: 'userId',
            as: 'categories',
            onDelete: 'CASCADE'
        });

        // User has many Transactions
        User.hasMany(models.Transaction, {
            foreignKey: 'userId',
            as: 'transactions',
            onDelete: 'CASCADE'
        });

        // User has many Budgets
        User.hasMany(models.Budget, {
            foreignKey: 'userId',
            as: 'budgets',
            onDelete: 'CASCADE'
        });

        // User has many SavingsGoals
        User.hasMany(models.SavingsGoal, {
            foreignKey: 'userId',
            as: 'savingsGoals',
            onDelete: 'CASCADE'
        });
    };

    return User;

};
