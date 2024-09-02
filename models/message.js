module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true, // Adds createdAt and updatedAt fields
    },
  );

  return Message;
};
