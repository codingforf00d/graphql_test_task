/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRepository, ObjectType, SelectQueryBuilder } from "typeorm";

export type AnySelectQueryBuilder = SelectQueryBuilder<any>;
export enum JoinType {
  LEFT = "left",
  INNER = "inner",
}
interface EntityWithName {
  name: string;
}

interface JoinParams<Entity> {
  field?: keyof Entity | null;
  joinType?: JoinType;
  alias?: string;
  condition?: string;
  parameters?: Record<string, any>;
}

export abstract class AbstractQueryBuilder<Entity> {
  qb: SelectQueryBuilder<Entity>;
  private joinMap: Map<string, { joinTable: string; joinType: JoinType }> =
    new Map();

  protected constructor(
    readonly entity: ObjectType<Entity>,
    readonly alias: string,
    qb?: AnySelectQueryBuilder
  ) {
    if (!alias || !entity) {
      throw new Error("Wrong params");
    }

    const repository = getRepository(entity);
    this.qb = qb ? qb : repository.createQueryBuilder(alias);
  }

  /**
   * Кто первый вызовет find с take & offset те значения и установятся.
   * Fixed #CIMP-1121
   */
  protected takeAndOffset({
    take,
    offset,
  }: {
    take?: number;
    offset?: number;
  }) {
    if (!this.qb.expressionMap.take && take) {
      this.qb.take(take);
    }

    if (!this.qb.expressionMap.skip && offset) {
      this.qb.skip(offset);
    }
  }

  protected limitAndOffset({
    limit,
    offset,
  }: {
    limit?: number;
    offset?: number;
  }) {
    if (!this.qb.expressionMap.limit && limit) {
      this.qb.limit(limit);
    }

    if (!this.qb.expressionMap.offset && offset) {
      this.qb.offset(offset);
    }
  }

  public join<E extends EntityWithName>(
    entityOrField: E | string,
    {
      joinType = JoinType.LEFT,
      alias,
      condition,
      parameters,
    }: JoinParams<Entity>
  ): this {
    return this.joinAndSelect(entityOrField, {
      alias,
      condition,
      joinType,
      parameters,
      field: null,
    });
  }

  public joinAndSelect<E extends EntityWithName>(
    entityOrField: E | string,
    {
      field,
      joinType = JoinType.LEFT,
      alias,
      condition,
      parameters,
    }: JoinParams<Entity>
  ): this {
    let joinTable;
    let property;

    if (typeof entityOrField === "string") {
      if (entityOrField.includes(".")) {
        [joinTable, property] = entityOrField.split(".");
      } else {
        joinTable = entityOrField;
      }
    } else {
      const entityRepository = getRepository(entityOrField.name);
      joinTable = entityRepository.metadata.tableName;
    }

    const fieldOrProperty = field || property;
    const aliasOrTableName = alias || joinTable;
    const mapKey = `${aliasOrTableName}_${joinType}`;
    let joinFn: Function;

    if (this.joinMap.has(mapKey)) {
      return this;
    }

    this.joinMap.set(mapKey, { joinTable, joinType });

    switch (joinType) {
      case JoinType.LEFT:
        if (fieldOrProperty) {
          joinFn = this.qb.leftJoinAndSelect;
        } else {
          joinFn = this.qb.leftJoin;
        }
        break;
      case JoinType.INNER:
        if (fieldOrProperty) {
          joinFn = this.qb.innerJoinAndSelect;
        } else {
          joinFn = this.qb.innerJoin;
        }
        break;
      default:
        throw new Error(`JoinType ${joinType} is not supported`);
    }

    let fnArgs: Array<any> = [];

    if (fieldOrProperty) {
      fnArgs = [
        `${this.alias}.${new String(fieldOrProperty)}`,
        aliasOrTableName,
      ];
      if (condition) {
        fnArgs.push(condition);
      }
      joinFn.apply(this.qb, fnArgs);
    } else {
      fnArgs = [aliasOrTableName];
      if (condition) {
        fnArgs.push(condition);
        if (parameters) {
          fnArgs.push(parameters);
        }
      }
      joinFn.apply(this.qb, fnArgs);
    }

    return this;
  }
}
