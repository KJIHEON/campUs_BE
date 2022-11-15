import { DataTypes, Model, Association } from 'sequelize';

import sequelize from './sequlize';

export class Trip extends Model {
  //? 조회 후 사용 되어질 요소들의 타입명시 설정이 되어 있지 않으면 조회시 또는 조회 후 데이터 타입체크에서 오류
  public readonly tripId!: number;
  public userId!: number;
  public date!: Date;
  //관계 설정
  public static associations: {};
}

//? 모델 생성
Trip.init(
  {
    tripId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.MEDIUMINT,
    },
    userId: {
      allowNull: false,
      type: DataTypes.MEDIUMINT,
    },
    date: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize, //? 생성한 Sequelize 객체 패싱
    modelName: 'trip',
    tableName: 'Trip',
    freezeTableName: true,
    timestamps: false,
  }
);
export default Trip;
