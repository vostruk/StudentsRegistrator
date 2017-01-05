'use strict';

angular.module('apsiFrontendApp')
.service('Session', function () {
  this.create = function (sessionId, userId, userRole, userName) {
    this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;
    this.userName = userName;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
    this.userRole = null;
    this.userName = null;
  };
});