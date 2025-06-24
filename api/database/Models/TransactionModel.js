const { where } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('income', 'expense'),
            allowNull: false,
        },
        description: DataTypes.TEXT,
        transaction_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        payment_method: {
            type: DataTypes.ENUM('cash', 'debit_card', 'credit_card', 'bank_transfer', 'digital_wallet')
        },
        tags: {
            type: DataTypes.JSONB,
        },
        receipt_url: DataTypes.TEXT,
        notes: DataTypes.TEXT,
        is_recurring: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        recurring_period: {
            type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
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
        tableName: 'transactions',
        timestamps: false,
        indexes: [
            { fields: ['userId', 'transaction_date'], name: 'transactions_user_date_idx' },
            { fields: ['categoryId'], name: 'transactions_category_idx' },
            { fields: ['type'], name: 'transactions_type_idx' },
            { fields: ['tags'], using: 'GIN', name: 'transactions_tags_idx' }
        ]
    });

    Transaction.findById = async function (id){
        return await this.findOne(
            {
                where: {
                    id: id
                }
            }
        );
    };

    Transaction.associate = (models) => {
        Transaction.belongsTo(models.User, {
            foreignKey: 'userId',
            allowNull: false,
            onDelete: 'CASCADE'
        });

        Transaction.belongsTo(models.Category, {
            foreignKey: 'categoryId',
            allowNull: false,
            onDelete: 'RESTRICT'
        });

        Transaction.belongsToMany(models.Budget, {
            through: models.BudgetTransaction,
            foreignKey: 'transactionId',
            otherKey: 'budgetId',
        });
    };

    return Transaction;
};