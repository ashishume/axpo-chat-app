const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  "postgres://postgres.bsepxzyduavckhrddilb:RV3bxxocMfinqakN@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
  {
    dialect: "postgres",
  }
);

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Room = sequelize.define("Room", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  isGroup: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

const RoomMember = sequelize.define("RoomMember", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  roomId: {
    type: DataTypes.UUID,
    references: {
      model: Room,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  roomId: {
    type: DataTypes.UUID,
    references: {
      model: Room,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
});

User.hasMany(Message, { foreignKey: "userId" });
Room.hasMany(Message, { foreignKey: "roomId" });
Room.belongsToMany(User, { through: RoomMember, foreignKey: "roomId" });
User.belongsToMany(Room, { through: RoomMember, foreignKey: "userId" });

sequelize.sync().then(() => {
  console.log("Database & tables created!");
});

module.exports = { sequelize, User, Room, RoomMember, Message };
