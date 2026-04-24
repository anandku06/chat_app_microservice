// This file defines the UserCredentialsAttribute interface, which represents the attributes of a user's credentials in the authentication service.

import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/db/sequelize";

// includes properties such as id, email, displayName, passwordHash, createdAt, and updatedAt. This interface is used to ensure type safety when working with user credentials in the application.
export interface UserCredentialsAttribute {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

// This type defines the attributes that are required when creating a new user credentials record. It makes the id, createdAt, and updatedAt properties optional, as these will typically be generated automatically by the database when a new record is created.
export type UserCredentialsCreationAttributes = Optional<
  UserCredentialsAttribute,
  "id" | "createdAt" | "updatedAt"
>;

// The UserCredentials class extends the Sequelize Model class, providing a structured way to interact with the user credentials data in the database. It implements the UserCredentialsAttribute interface, ensuring that all required properties are present when working with instances of this model. This class will be used to define the user credentials model in Sequelize and to perform database operations related to user credentials.
export class UserCredentials
  extends Model<UserCredentialsAttribute, UserCredentialsCreationAttributes>
  implements UserCredentialsAttribute
{
  declare id: string;
  declare email: string;
  declare displayName: string;
  declare passwordHash: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

UserCredentials.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "user_credentials",
  },
);
