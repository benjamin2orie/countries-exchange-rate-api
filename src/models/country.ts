
import { DataTypes} from "sequelize";
import { sequelize } from "../config/db.js";


export const Country = sequelize.define('Country', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  capital: { type: DataTypes.STRING },
  region: { type: DataTypes.STRING },
  population: { type: DataTypes.INTEGER, allowNull: false },
  currency_code: { type: DataTypes.STRING },
  exchange_rate: { type: DataTypes.FLOAT },
  estimated_gdp: { type: DataTypes.FLOAT },
  flag_url: { type: DataTypes.STRING },
  last_refreshed_at: { type: DataTypes.DATE },
});