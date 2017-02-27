(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController )
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItems);


function FoundItems() {
  var ddo = {
      templateUrl: 'resultTemplate.html',
      scope: {
        items: '<',
        onRemove: '&'
      },
      controller: MenuDirectiveController,
      controllerAs: 'menu',
      bindToController: true
  };
  return ddo;
}

  
function MenuDirectiveController() {
  var menu = this;

  menu.removeItem = function (itemIdex) {
      menu.items.splice(itemIdex,1);
  };

}


NarrowItDownController.$inject = ['$scope', 'MenuSearchService'];

function NarrowItDownController ($scope, MenuSearchService) {

  $scope.searchTerm = null;
  var menu = this;
  menu.foundItems = [];
  menu.errorMessage = "";
  menu.getResults = function (searchString) { 
      var promise  = MenuSearchService.getMatchedMenuItems();
      
      promise.then(function (response) {
        var string = "";
        angular.forEach(response.data.menu_items, function(item) {
          string = item.description;

          if (string.includes(searchString)) {
                   menu.foundItems.push({name: item.name, 
                                           description: item.description, 
                                           short_name: item.short_name});
                 }
            
        });
        return menu.foundItems;

      })

      .catch(function (error) {
        menu.errorMessage = "Something went terribly wrong.";
        return menu.errorMessage;
      })

  };
  
  
  
}


MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService( $http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function () {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    })
    return response;
  };

}

})();
