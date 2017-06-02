"use strict";

angular.module('moneyApp.controllers', [])



.controller('homeCtrl', function($scope, $http){

})

.controller('budgetsCtrl', function($scope){

})

.controller('actionsCtrl', function($scope, categoriesServ){
  $scope.categories = [];
  categoriesServ.getCategories(function(data){
    if (data.status == 'success'){
      data.arr = data.arr ? data.arr : [];
      $scope.categories = data.arr;
    }
  });
});
