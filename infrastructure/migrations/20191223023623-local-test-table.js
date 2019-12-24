'use strict';

var dbm;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
};

exports.up = async function(db) {
  await db.runSql(`
    CREATE TABLE local_test (
      id int
    );
  `);
};

exports.down = async function(db) {
  await db.runSql(`
    DROP TABLE local_test;
  `);
};

exports._meta = {
  "version": 1
};
