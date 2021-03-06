(function() {
  var module = angular.module('ezDirectives');
    this.materialTemplate = [
      '<span>',
        '<img style="height:40px;width:40px" ng-class="[rotate, {orange: doRotate}]" src="{{img}}" />',
      '</span>'
    ].join('\n');
  module.directive('cpLogo', [
    '$timeout', function($timeout) {
      return {
        restrict: 'E',
        template: this.materialTemplate,
        replace: true,
        scope: {
          doRotate:"=",
          img: "="
        },
        //controller start
        controller: ["$scope", function ($scope) {      
        }]//controller ends
      }}
  ]);//directive ends  
    
    
    
})();//closure ends
