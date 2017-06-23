exports.defaultPlugins = [
  require("./plugins/PgIntrospectionPlugin"),
  require("./plugins/PgTypesPlugin"),
  require("./plugins/PgTablesPlugin"),
  require("./plugins/PgAllRows"),
  require("./plugins/PgColumnsPlugin"),
  require("./plugins/PgForwardRelationPlugin"),
  //require("./plugins/PgRowByUniqueConstraint"),
  //require("./plugins/PgComputedColumnsPlugin"),
  //require("./plugins/PgBackwardRelationPlugin"),
  //require("./plugins/PgConnectionArgs"),
];
exports.inflections = require("./inflections");
