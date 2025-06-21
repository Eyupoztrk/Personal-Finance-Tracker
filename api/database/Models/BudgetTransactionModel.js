module.exports = (sequelize, DataTypes) => {

    const BudgetTransaction = sequelize.define('BudgetTransaction', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        allocated_amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    }, {
        tableName: 'budget_transactions',
        timestamps: false,
        indexes: [
            { fields: ['budgetId'], name: 'budget_transactions_budget_idx' },
            { fields: ['transactionId'], name: 'budget_transactions_transaction_idx' }
        ],
        uniqueKeys: {
            budget_transaction_unique: {
                fields: ['budgetId', 'transactionId']
            }
        }
    });

    BudgetTransaction.associate = (models) => {
        BudgetTransaction.belongsTo(models.Budget, {
            foreignKey: 'budgetId',
            onDelete: 'CASCADE'
        });

        BudgetTransaction.belongsTo(models.Transaction, {
            foreignKey: 'transactionId',
            onDelete: 'CASCADE'
        });
    };

    return BudgetTransaction;
};