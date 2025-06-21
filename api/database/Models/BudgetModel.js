module.exports = (sequelize, DataTypes) => {
    

    const Budget = sequelize.define('Budget', {
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
        spent_amount: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0.00,
        },
        period_type: {
            type: DataTypes.ENUM('monthly', 'quarterly', 'yearly', 'custom'),
            allowNull: false,
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        alert_threshold: {
            type: DataTypes.INTEGER,
            defaultValue: 80,
        },
        alert_enabled: {
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
        tableName: 'budgets',
        timestamps: false,
        indexes: [
            { fields: ['userId', 'is_active'], name: 'budgets_user_active_idx' },
            { fields: ['start_date', 'end_date'], name: 'budgets_period_idx' },
            { fields: ['categoryId'], name: 'budgets_category_idx' }
        ]
    });

    Budget.associate = (models) => {
        Budget.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });

        Budget.belongsTo(models.Category, {
            foreignKey: 'categoryId',
            onDelete: 'SET NULL'
        });

        Budget.belongsToMany(models.Transaction, {
            through: models.BudgetTransaction,
            foreignKey: 'budgetId',
            otherKey: 'transactionId',
        });
    };

    return Budget;

}