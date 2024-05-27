// models/role.js

const roles = require("../config/roles.json");

class Role {
  constructor() {
    this.roles = roles.roles;
  }

  getRoleByName(category) {
    return this.roles.find((role) => role.name === category);
  }

  getRoles() {
    return this.roles;
  }
}

module.exports = Role;
