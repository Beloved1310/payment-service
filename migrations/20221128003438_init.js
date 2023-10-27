/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.varchar("name", 255).notNullable();
        table.varchar("email", 255).notNullable().unique();
        table.varchar("password").notNullable();
        table.integer("account", 9).notNullable().defaultTo(0);
        table.integer("wallet").notNullable().defaultTo(0);
        table.string("currency").defaultTo("Naira");
        table.timestamps(true, true);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("users");
};
