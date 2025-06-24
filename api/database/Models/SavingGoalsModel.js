const BudgetTransactionModel = require("./BudgetTransactionModel");

module.exports = (sequelize, DataTypes)  => {


    const SavingsGoal = sequelize.define('SavingsGoal', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        target_amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        current_amount: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0.00,
        },
        target_date: DataTypes.DATEONLY,
        priority: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        is_completed: {
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
    }, {
        tableName: 'savings_goals',
        timestamps: false
    });

     SavingsGoal.findById = async function (id) {
        return await this.findOne({
            where:{
                id: id
            }
        });
    };

    SavingsGoal.associate = (models) => {
        SavingsGoal.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
    };

    return SavingsGoal;

};
