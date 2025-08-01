
const { where, BelongsToMany, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("Category", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Name cannot be empty"
                }
            }
        },
        type: {
            type: DataTypes.ENUM('income', 'expense'),
            allowNull: false,
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    },
        {
            tableName: "categories",
            timestamps: false,
            indexes: [
                {
                    fields: ["userId", "type"], name: "categories_user_type_idx"
                },
                {
                    fields: ["is_active"], name: "categories_active_idx"
                }
            ]
        }

    );

    Category.getCategoryName = async function (name) {
        return await this.findOne({

            where: {
                name: name.toLowerCase(),
            }

        });
    };

    Category.findById = async function (id) {
        return await this.findOne({
            where:{
                id: id
            }
        });
    };

    Category.associate = (models) => {
        Category.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            as: 'users',
        });

        Category.hasMany(models.Transaction, {
            foreignKey: 'categoryId',
        });

        Category.hasMany(models.Budget, {
            foreignKey: 'categoryId',
        });
    };


    return Category;

};