import { schema } from './database-schema';
import { extractConditionsWith, extractUpdatesWith,
         extractOptionsWith, defaults } from './database-utils';


export const fetchAll = ({ resource, params = {}, options = {} }) => {
  return schema.then((database) => {
    const table      = database.getSchema().table(resource);
    const conditions = extractConditionsWith(table, params);
    const scope      = database.select().from(table);

    return extractOptionsWith(scope, table, options).where(conditions).exec();
  });
};


export const fetchOne = ({ resource, params = {} }) => {
  return schema.then((database) => {
    const table      = database.getSchema().table(resource);
    const conditions = extractConditionsWith(table, params);

    return database.select().from(table).where(conditions).exec().then((r) => {
      if(r[0] === undefined) {
        return Promise.reject();
      }

      return Promise.resolve(r[0]);
    });
  });
};


export const create = ({ resource, data, sync = false }) => {
  return schema.then((database) => {
    const table = database.getSchema().table(resource);
    const row   = table.createRow(defaults(table, data));

    return database.insert().into(table).values([row]).exec().then(
      (result) => {
        if(result[0] === undefined) {
          return Promise.reject();
        }

        return Promise.resolve(result[0]);
      }
    );
  });
};


export const destroy = ({ resource, params = {}, sync = false }) => {
  return schema.then((database) => {
    const table      = database.getSchema().table(resource);
    const conditions = extractConditionsWith(table, params);

    return database.delete().from(table).where(conditions).exec().then(() => {
      return Promise.resolve(params.id || null);
    });
  });
};


export const softDelete = ({ resource, params = {}, sync = false }) => {
  return schema.then((database) => {
    const table      = databse.getSchema().table(resource);
    const conditions = extractConditionsWith(table, params);

    return databse.update(table)
                  .set(table.deleted_at, +new Date())
                  .where(conditions)
                  .exec()
                  .then(() => {
                    return Promise.resolve(params.id || null);
                  });
  });
};


export const update = ({ resource, data, params = {}, sync = false }) => {
  return schema.then((database) => {
    const table      = database.getSchema().table(resource);
    const conditions = extractConditionsWith(table, params);
    const scope      = database.update(table);

    if(params.id) {
      data = { ...data, id: params.id };
    }

    return extractUpdatesWith(scope, table, data).where(conditions).exec().then(
      () => {
        return Promise.resolve(data);
      }
    );
  });
};
