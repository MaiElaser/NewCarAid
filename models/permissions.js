// models/permissions.js

class Permissions {
    constructor() {
      this.permissions = [];
    }
  
  getPermissionsByRoleName(category) {
      const role = roles.roles.find((r) => r.category === category);
      return role ? role.permissions : [];
    }
  }
  module.exports = Permissions;

