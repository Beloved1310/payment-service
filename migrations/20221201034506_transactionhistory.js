/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("transactionhistory", (table) => {
        table.increments("id").primary();
        table.integer("previousAmount").notNullable();
        table.integer("currentAmount").notNullable();
        table.string("currency").defaultTo("Naira");
        table.integer('userid').unsigned().notNullable().references('users.id');
        table.timestamps(true, true);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("transactionhistory");
};
