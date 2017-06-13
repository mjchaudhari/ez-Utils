(function() {
  
  var module = null;
  try {
        module = angular.module('ezDirectives');
    } catch (e) {
        module = angular.module('ezDirectives', []);
    }

    
  
  this.ezImageUploadTemplate = [
      '<div layout="column" layout-align="center center" ng-click="openThumbnailDialog($event)">',
      '  <div class="thumbnail-card"  ng-class="thumbnailClass"  >',
      '    <img src ng-src="{{img||defaultImage}}" class="md-avatar thumbnail-img" ng-class="thumbnailClass"  md-click="openThumbnailDialog($event)" /> ',
      '  </div>',
      '<script type="text/ng-template" id="/modalwindow.tpl.html"><div class="my-modal-dialog {{size ? \'modal-\' + size : \'\'}}"><div class="modal-content full-page-modal" uib-modal-transclude></div></div></script>'  ,
      '</div>'
      
    ].join('\n');

    
    this.ezImageUploadModalTemplate = [
        '<div class="height-stretch">',
        '    <nav class="navbar navbar-inverse navbar-fixed-top fixed-top sticky-top bg-primary">',
        '        <div class="navbar-header">',
        '            <a class="navbar-brand" href="">{{title}}</a>',
        '            <button class="float-right navbar-toggler" type="button" ng-click="cancelDialog()"><span class="material-icons">cancel</span></button>',
        '            <button ng-if="thumb.sourceFile" class="float-right navbar-toggler" type="button" ng-click="closeDialog()" ><span class="material-icons">save</span> </button>',
        '        </div>',
        '    </nav>',
        '    <div class="" role="main">',
        '        <div class="div-center cropArea">',
        '            <i class="material-icons-lg" ngf-select="" ng-model="thumb.sourceFile" >file_upload </i> ',
        '            <h5 ng-if="thumb.sourceFile==null">Select Image</h5>',
        '            <ui-cropper ng-if="thumb.sourceFile" image="thumb.sourceFile|ngfDataUrl" area-type="{{thumb.cropperGuide}}" area-min-size="thumb.cropperMinSize" result-image-size="thumb.resultSize" ',
        '                result-image="thumb.croppedDataUrl" ng-init="croppedDataUrl=\'\'">',
        '            </ui-cropper>',
                    
        '        </div>',
        '   </div>',
        '</div>',
    ].join('\n');

    
  module.directive('ezImageUpload', ['$timeout', 
    function($timeout) {
      return {
        restrict: 'AE',
        template: this.ezImageUploadTemplate,
        replace: true,
        scope: {
          img: '=',
          defaultImage: "=?",
          thumbnailClass:"=?"
        },
        //controller start
        controller: ["$scope","Upload",'$uibModal', function ($scope, Upload, $uibModal) {
          var originalImg = $scope.img;
          var thumb = {
              croppedDataUrl:'',
              sourceFile:'',
              cropperMinSize : 80,
              resultSize : 100,
              cropperGuide : 'square'
          }
          //$scope.defaultImage = "./images/group-default3.png";
          $scope.thumnailClass="";
          var init = function(){
            
          }
          
          $scope.resetImage = function(){
              if(originalImg ){
                      $scope.img = originalImg;
              }
              else if($scope.defaultImage)
              {
                     $scope.img = $scope.defaultImage; 
              }
          }
          $scope.uploadFiles = function(file, errFiles){
                
              if (file) {
                  var baseUrl = config.apiBaseURL
                  file.upload = Upload.upload({
                      url: config.apiBaseUrl + '/v1/file',
                      data: {file: file}
                  });

                  file.upload.then(function (response) {
                      $timeout(function () {
                          //file.result = response.data;
                          if(!response.data.isError){
                              $scope.img = response.data.url;
                          }
                      });
                  }, function (response) {
                      if (response.status > 0)
                          $scope.errorMsg = response.status + ': ' + response.data;
                  }, function (evt) {
                      file.progress = Math.min(100, parseInt(100.0 * 
                                               evt.loaded / evt.total));
                  });
              }
          }

          $scope.$watch('img', function(newValue, oldValue){
              if(newValue)
              {
                  $scope.img = newValue;
              }
          });
          $scope.$watch('defaultImage', function(newValue, oldValue){
              if(newValue)
              {
                  $scope.defaultImage = newValue;
              }
              else{
                $scope.defaultImage = "https://placehold.it/100x100";
              }
          });
          
          $scope.$watch('thumbnailClass', function(newValue, oldValue){
              if(newValue)
              {
                  $scope.thumbnailClass = newValue;
              }
              else{
                $scope.thumbnailClass = "";
              }
          });
          $scope.openThumbnailDialog = function($event){
              var memberModal = $uibModal.open({
                // ariaLabelledBy: 'modal-title',
                // ariaDescribedBy: 'modal-body',
                windowTemplateUrl:"/modalwindow.tpl.html",
                template : ezImageUploadModalTemplate,
                // windowClass:"my-modal-dialog",
                // windowTopClass : "full-page-modal",
                controller: DialogController,
                size:'lg',
                resolve:{
                    options: function(){
                        return $scope.options;
                    }
                }
            });
            memberModal.result
            .then(function(data){
                $scope.img = data;
            }, function(){
                //cancelled
            });

            function DialogController($scope, $uibModalInstance) {
                $scope.sourceFile = "";
                
                $scope.thumb = thumb;
                $scope.openSelectFile = function(dataUrl ){
                    console.info(dataUrl);
                }
                $scope.closeDialog = function() {
                  $uibModalInstance.close($scope.thumb.croppedDataUrl);
                }
                $scope.cancelDialog = function() {
                  $uibModalInstance.dismiss();
                }
              }
          }
          
          init();
          
        }]//controller ends
            
      }}
  ]);//directive ends  
})();//closure ends