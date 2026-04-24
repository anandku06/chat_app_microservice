// This file defines the RefreshTokenAttribute interface, which represents the attributes of a refresh token in the authentication service.

import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/db/sequelize";
import { UserCredentials } from "./userCreds.model";

// This type defines the attributes that are required when creating a new refresh token record. It makes the id, createdAt, and updatedAt properties optional, as these will typically be generated automatically by the database when a new record is created.
export interface RefreshTokenAttribute {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type RefreshTokenCreationAttributes = Optional<
  RefreshTokenAttribute,
  "id" | "createdAt" | "updatedAt"
>;

export class RefreshToken
  extends Model<RefreshTokenAttribute, RefreshTokenCreationAttributes>
  implements RefreshTokenAttribute
{
  declare id: string;
  declare userId: string;
  declare token: string;
  declare expiresAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "refresh_tokens",
  },
);

// This section defines the associations between the RefreshToken model and the UserCredentials model. It establishes a one-to-many relationship, where a user can have multiple refresh tokens, and each refresh token belongs to a single user. The foreign key is defined as userId in the RefreshToken model, and the association is set to cascade on delete, meaning that if a user is deleted, all associated refresh tokens will also be deleted.
UserCredentials.hasMany(RefreshToken, {
  foreignKey: "userId",
  as: "refreshTokens",
  onDelete: "CASCADE",
});

RefreshToken.belongsTo(UserCredentials, {
  foreignKey: "userId",
  as: "user",
});
