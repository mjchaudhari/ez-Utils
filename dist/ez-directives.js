(function() {
    angular.module('ezDirectives', ['uiCropper']);
})();
(function() {
  
  var module = angular.module('ezDirectives');
    
  this.extemplate = [
    '<md-card>',
      '<md-card-title class="">',
        '<div layout="row" layout-align="left center">',
          '<md-button layout="row" class="expando__icon md-icon-button " ng-class=\"{\'active\': isActive}\" ng-click="toggle()">',
            '<i class="material-icons">settings_power</i>',
          '</md-button>',
          '<span class=""  ng-bind="expandoTitle">{{expandoTitle}}</span>',
        '</div>',
      '</md-card-title>',
      '<md-card-content>',
        '<div class=""   ng-if="areaExpand">',
          '<div ng-transclude></div>', 
        '</div>',
      '</md-card-content>',
    '</md-card>'
    ].join('\n');
    
  module.directive('ezExpando', [
    '$timeout', function($timeout) {
      return {
        restrict: 'AE',
        template: this.extemplate,
        replace: true,
        transclude: true,
        scope: {
          expandoTitle : '@',
          areaExpand : '@'
        },

        //controller start
        controller: ["$scope", function ($scope) {
          $scope.expandoTitle = "";
          $scope.areaExpand = false;
          $scope.isActive = false;
          var init = function(){
            
          }

          // Google Expando Method
          // =====================================================

          $scope.toggle =function() {
            // $(this).toggleClass('active');
            // $(this).next().toggleClass('active');
            $scope.isActive = !$scope.isActive;
            // ARIA
            $scope.areaExpand = !$scope.areaExpand;  
          }
  
          $scope.$watch('expandoTitle', function(newValue, oldValue){
              $scope.expandoTitle = newValue;
          });
          $scope.$watch('areaExpand', function(newValue, oldValue){
              $scope.areaExpand = newValue;
          });
          
          init();
          
        }]//controller ends
            
      }}
  ]);//directive ends  
    
    
    
})();//closure ends
(function() {
  
  var module = angular.module('ezDirectives');
  this.ezImageUploadTemplate = [
      '<div layout="column" layout-align="center center" ng-click="openThumbnailDialog($event)">',
      '  <div class="thumbnail-card"  ng-class="thumbnailClass"  >',
      //'    <img ng-hide="{{img!=null}}" src ng-src="{{defaultImage}}" class="md-avatar thumbnail-img"  md-click="openThumbnailDialog($event)" /> ',
      '    <img src ng-src="{{img||defaultImage}}" class="md-avatar thumbnail-img" ng-class="thumbnailClass"  md-click="openThumbnailDialog($event)" /> ',
      '  </div>',
//       '  <md-button ng-hide class="md-icon-button" ng-click="openThumbnailDialog($event)">',
//       '     <i class="material-icons">edit</i>',
//       '  </md-button>',
      '</div>'
        
    ].join('\n');

    
    this.ezImageUploadModalTemplate = [
          '<md-dialog flex="100" style="height:100vh" aria-label="List dialog">',
             '<md-dialog-content>',
                '<md-toolbar md-scroll-shrink="false">',
                  '<div class="md-toolbar-tools">',
                      '<md-button class="md-icon-button" ng-click="cancelDialog()"  aria-label="close">',
                        '<ng-md-icon icon="cancel"></ng-md-icon> ',
                      '</md-button>',
                      '<span flex>{{title}}</span>',
                      '<div ng-show="uploading" class="" layout="row" layout-align="end">',
                          '<img style="height:40px;width:40px" class="rotating" src="./content/images/cp.png" />',
                      '</div>',
                      '<md-button class="md-icon-button" ng-click="closeDialog()"  aria-label="close">',
                        '<ng-md-icon icon="save"></ng-md-icon> ',
                      '</md-button>',
                  '</div>',
                '</md-toolbar>',
                '<div layout-padding>',
                  '<md-switch ng-model="thumb.isCircle" aria-label="Use circular cropper area:" ng-change="areaChange(thumb.isCircle)" class="md-warn">',
                       'Use square cropper area',
                  '</md-switch>',
                  '<div layout="column" layout-align="center center" class="cropArea">',
                        
                        '<input type="file"  class="md-fab md-mini" ngf-select=""  ', 
                            'ng-model="thumb.sourceFile" >',

                        '</input > ',
                      '<ui-cropper image="thumb.sourceFile|ngfDataUrl" area-type="{{thumb.cropperGuide}}"',
                      '    area-min-size="thumb.cropperMinSize" result-image-size="thumb.resultSize" ',
                      '    result-image="thumb.croppedDataUrl" ng-init="croppedDataUrl=\'\'">',
                      '</ui-cropper>',
                      
                    //   '<img-crop image="thumb.sourceFile|ngfDataUrl" area-type="{{thumb.cropperGuide}}" result-image="thumb.croppedDataUrl" >',
                    //   '</img-crop>',
                      '<h3>Preiew</h3>',
                      '<img src="{{thumb.croppedDataUrl}}" />',
                  '</div>',

              '</div>',
             '</md-dialog-content>',
         '</md-dialog>',
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
        controller: ["$scope","Upload",'$mdDialog', function ($scope, Upload,$mdDialog) {
          var originalImg = $scope.img;
          var thumb = {
              croppedDataUrl:'',
              sourceFile:'',
              cropperMinSize : 80,
              resultSize : 100,
              cropperGuide : 'circle'
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
               var parentEl = angular.element(document.body);
               $mdDialog.show({
                 parent: parentEl,
                 targetEvent: $event,
                 template:ezImageUploadModalTemplate,
                 locals: {
                   items: $scope.items,
                   thumb : $scope.thumb,
                 },
                 controller: DialogController
              }).then(function(dataUrl){
                $scope.img = dataUrl;
              },function(){

              });
              
              function DialogController($scope, $mdDialog, items, Upload) {
                $scope.items = items;
                $scope.sourceFile = "";
                scope = $scope;
                $scope.thumb = thumb;
                $scope.openSelectFile = function(dataUrl ){
                    console.info(dataUrl);
                }
                $scope.areaChange=function (model){
                  if(!model){
                    $scope.thumb.cropperGuide = "circle";
                  }else{
                    $scope.thumb.cropperGuide = "square";
                  }
                }
                $scope.closeDialog = function() {
                  $mdDialog.hide($scope.thumb.croppedDataUrl);
                }
                $scope.cancelDialog = function() {
                  $mdDialog.cancel();
                }
              }
          }

          
          init();
          
        }]//controller ends
            
      }}
  ]);//directive ends  
})();//closure ends
(function() {
  
  var module = angular.module('ezDirectives');
    
  this.ezinitialsTemplate = [
//         '<span class="initials-circle" style="background: blueviolet;" >',
//             '<span style="color: whitesmoke;margin:0;">{{initials}}</span>',
//         '</span> ',
        '<span>',
          '<img ng-if="img!=null" src="{{img}}" class="md-avatar avatar-small" ng-class="thumbnailClass" /> ',
          '<div ng-if="img==null" class="circle ">{{initials}}</div>',
        '</span>',
    ].join('\n');
    
  module.directive('ezThumb', [
    '$timeout', function($timeout) {
      return {
        restrict: 'E',
        template: this.ezinitialsTemplate,
        replace: true,
        scope: {
          text: '=',
          img: '=',
          thumbnailClass:"=?"
        },
        //controller start
        controller: ["$scope", function ($scope) {
          $scope.initials = "";
          $scope.thumnailClass="";
          var init = function(){
            if($scope.text == null){
              $scope.text = "";
            }
            var matches = $scope.text.match(/\b(\w)/g);
            if(matches){
              var inits = matches.join('');
              $scope.initials =  inits.substring(0,2);
            }
          }
          $scope.$watch('img', function(newValue, oldValue){
              if(newValue)
              {
                  $scope.img = newValue;
              }
          });
          $scope.$watch('text', function(newValue, oldValue){
              if(newValue)
              {
                  init();
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
          
          init();
          
        }]//controller ends
            
      }}
  ]);//directive ends  
    
    
    
})();//closure ends
(function() {
  var module = angular.module('ezDirectives');  
  this.scrollTemplate = [
//         '<span class="initials-circle" style="background: blueviolet;" >',
//             '<span style="color: whitesmoke;margin:0;">{{initials}}</span>',
//         '</span> ',
        '<div >',
          '<img ng-if="img!=null" src="{{img}}" class="md-avatar avatar-small" /> ',
          '<div ng-if="img==null" class="circle accent  md-title">{{initials}}</div>',
        '</div>',
    ].join('\n');
    
  module.directive('ezScroll', [
    '$timeout', function($timeout) {
      return {
        restrict: 'E',
        template: this.scrollTemplate,
        replace: true,
        scope: {
          height: '=',
        },
        //controller start
        controller: ["$scope", function ($scope) {
          $scope.initials = "";

          var init = function(){
            
          }
          $scope.$watch('height', function(newValue, oldValue){
              if(newValue)
              {
                  init()
              }
          });
          
          init();
          
        }]//controller ends
            
      }}
  ]);//directive ends  
    
    
    
})();//closure ends
(function() {
  var module = angular.module('ezDirectives');
  this.template = [
    '<div>{{title}} ',
        '<ul style="list-style-type:none;">',
          '<div ng-repeat="n in flatTree">',
            '<li  class="node" ng-if="!n.__isHidden"',
                'ng-class=" { \'node-selected\':n.__isSelected, \'node-unselected\': !n.__isSelected}">',
              '<div style="width:100%;">',
                '<span ng-style="{\'margin-left\': levelMargin * n.__level + \'px\'}" >',
                  '<span ng-if="!n.__isLeaf && !n.__isExpanded"  >',
                    '<span ng-if="n.__hasChildren" ng-click="toggleNodeVisibility(n,$event)" style="margine-right:2px;" class="handCursor tree-toggler tree-toggler-right glyphicon glyphicon-chevron-right "></span>',
                    '<span ng-if="!n.__hasChildren" class="handCursor tree-toggler tree-toggler-right  icon-blank icon-spacer padding-right:{{levelMargin}}px""></span>',
                    '<span ng-click="toggleSelection(n,$event)" class="handCursor mdi-file-folder mdi-action-view-module glyphicon glyphicon-folder-close"></span>',
                  '</span>',
                  '<span ng-if="!n.__isLeaf && n.__isExpanded"  >',
                    '<span  ng-if="n.__hasChildren" ng-click="toggleNodeVisibility(n,$event)" style="margine-right:2px;" class="handCursor tree-toggler tree-toggler-down glyphicon glyphicon-chevron-down"></span>',
                    '<span ng-if="!n.__hasChildren" class="handCursor tree-toggler tree-toggler-right  icon-blank icon-spacer padding-right:{{levelMargin}}px""></span>',
                    '<span ng-click="toggleSelection(n,$event)" class="handCursor mdi-file-folder-open mdi-action-view-module glyphicon glyphicon-folder-open"></span>',
                  '</span>',
                  '<span ng-if="n.__isLeaf"  >',
                    '<span ng-if="!n.__hasChildren" class="handCursor tree-toggler tree-toggler-right icon-blank icon-spacer" ng-style="{\'margin-left\': levelMargin + \'px\'}"></span>',
                    '<span ng-click="toggleSelection(n,$event)" class="handCursor mdi-file mdi-action-view-module glyphicon glyphicon-file"></span>',
                  '</span>',
                '</span> ',
                //'<div style=" background-color:red;" ng-click="toggleSelection(n,$event)"> ',
                    '<span class="handCursor" ng-click="toggleSelection(n,$event)">{{n[options.nameAttrib]}}</span>',
                //'</div>',  
              '</div>',
            '</li>',
          '</div>',
        '</ul>',
      '</div>',
    ].join('\n');
    
    this.materialTemplate = [
    '<div >{{title}} ',
        '<ul style="list-style-type:none;padding: 10px;">',
          '<div ng-repeat="n in flatTree">',
            '<li  class="node" ng-if="!n.__isHidden"',
                'ng-class=" { \'node-selected\':n.__isSelected, \'node-unselected\': !n.__isSelected}">',
              '<div style="width:100%;"  layout="row" layout-align="left center ">',
                '<span ng-style=\"{\'margin-left\':levelMargin * n.__level + \'px\'}\" >',
                  
                  '<span ng-if="!n.__isLeaf && !n.__isExpanded"  >',                    
                    '<span ng-if="n.__hasChildren" ng-click="toggleNodeVisibility(n,$event)" style="margine-right:2px;" class="handCursor tree-toggler  tree-toggler-right "> <i class="material-icons">play_arrow</i></span>',
                    '<span ng-if="!n.__hasChildren" class="icon-spacer" style="padding-right:{{levelMargin}}px"></span>',
                    '<span ng-click="toggleSelection(n,$event)" class="handCursor mdi-file-folder mdi-action-view-module "><i class="material-icons">{{n.icon || "folder"}}</i> </span>',
                  '</span>',
                  '<span ng-if="!n.__isLeaf && n.__isExpanded"  >',
                    '<span  ng-if="n.__hasChildren" ng-click="toggleNodeVisibility(n,$event)" style="margine-right:2px;" class="handCursor tree-toggler tree-toggler-down "><i class="material-icons rotate-270">play_arrow</i></span>',
                    '<span ng-if="!n.__hasChildren" style="margin-right:2px; padding-right:{{levelMargin}}px" class="handCursor tree-toggler tree-toggler-right  icon-spacer"></span>',
                    '<span ng-click="toggleSelection(n,$event)" class="handCursor mdi-file-folder-open mdi-action-view-module"><i class="material-icons">{{n.icon || "folder"}}</i></span>',
                  '</span>',
                  '<span ng-if="n.__isLeaf"  >',
                    '<span class="handCursor tree-toggler tree-toggler-right icon-spacer " ng-style="{\'margin-left\': levelMargin + \'px\'}"></span>',
                    '<span ng-click="toggleSelection(n,$event)" class="handCursor mdi-file mdi-action-view-module"><i class="material-icons">{{n.icon||"description"}}</i></span>',
                  '</span>',
                '</span> ',
                //'<div style=" background-color:red;" ng-click="toggleSelection(n,$event)"> ',
                    '<span class="handCursor" ng-click="toggleSelection(n,$event)">{{n[options.nameAttrib]}}</span>',
                //'</div>',  
              '</div>',
            '</li>',
          '</div>',
        '</ul>',
      '</div>',
    ].join('\n');
  module.directive('ezTree', [
    '$timeout', function($timeout) {
      return {
        restrict: 'AE',
        template: this.materialTemplate,
        replace: true,
        scope: {
          tree: '=',
          onSelect: '=',
          selectedNodes: '=',
          allowMultiSelect: '=',
          options:'=',
          parentTrail:"="
        },
        //controller start
        controller: ["$scope", function ($scope) {
            $scope.title = "";
            var options = {
                idAttrib: "Id",
                nameAttrib: "Name",
                childrenAttrib: "Children"

            };
          
            var init = function(){
                if($scope.options){
                    options = {
                        idAttrib        : $scope.options.idAttrib,
                        nameAttrib      :$scope.options.nameAttrib,
                        childrenAttrib  : $scope.options.childrenAttrib
                    };

                }
                else{
                    $scope.options = options;
                }
                $scope.levelMargin=25;
                $scope.flatTree = [];
                if($scope.tree){
                    var dupNode = angular.copy($scope.tree);
                    dupNode.__level = 0;
                    dupNode.__isHidden = false;
                    dupNode.__isExpanded = false;
                    dupNode.__isSelected = true;
                    dupNode.__hasChildren = true;
                    dupNode.__isLeaf = false;

                    dupNode[options.childrenAttrib] = null;

                    $scope.flatTree.push(dupNode);
                    var tree =  flattenTree($scope.tree); 
                    var arr=$scope.flatTree.concat(tree);
                    angular.copy(arr,$scope.flatTree);
                    //expand first node
                    expand(dupNode);
                }
          }
          
          
          //Make the flat array of the tree
          var flattenTree = function(node){
            var arr = [];
            if( node.__level === undefined)
            {
                node.__level = 0;
            }
            node.__isleaf = true
            if(node[options.childrenAttrib] && angular.isArray(node[options.childrenAttrib]))
            {
              node[options.childrenAttrib].forEach(function(n){
                node.__hasChildren = true;
                //make copy of this node because we are gng to remove the 
                //children and we do not want original tree to be affected.
                var nd = angular.copy(n);
                n.__level = node.__level + 1;
                nd.__isleaf = false;
                nd.__isHidden = true;
                nd.__isExpanded = false;
                nd.__isSelected = false;
                nd.__parent = node[options.idAttrib];
                nd.__level = n.__level;

                nd.__hasChildren = false;
                nd.__isLeaf = false;
                if(n[options.childrenAttrib] == null){
                        nd.__isLeaf = true;
                }
                else if (n[options.childrenAttrib].length > 0){
                        nd.__hasChildren = true;
                }


                nd[options.childrenAttrib] = null;
                arr.push(nd);
                //Recursive find for children of current tree node.
                var retArr = flattenTree(n);
                arr = arr.concat(retArr);
              });
            }
            return arr;
          };
          
          $scope.toggleNodeVisibility = function(node,event)
          {
            //Logic: If we are collapsing the node, then we need to hide all nodes in nodes's hierarchy. 
            // But if we are expanding it we shold only make the children visible and no all hierarchy
            node.__isExpanded = !node.__isExpanded;
            var hide = !node.__isExpanded;
            var goTillLeaf= false;
            if (event.ctrlKey==1 || event.altKey == 1){
                // Use windows.location or your link.
                goTillLeaf = true;
            }
            //because hide is always till leaf
            if(hide)
            {
              goTillLeaf = true;
            }
            setChildrenVisibility(node,hide, goTillLeaf)
          };
          
          $scope.toggleSelection = function(node,event){
            var currentVal = node.__isSelected;
            

            if (event.ctrlKey!=1 || event.altKey != 1){
                    if (!$scope.allowMultiSelect)
                    {
                        //if in single selection mode a selected node is selected again then do not process further
                        if(currentVal == true){
                          return;
                        }
                        unselectAll();
                }
            }

            var selected = [];
            $scope.flatTree.forEach(function(n){
              if(n[options.idAttrib] && n[options.idAttrib] == node[options.idAttrib])
              {
                n.__isSelected = !currentVal;  
              }
              if(n.__isSelected){
                  selected.push(n);
              }
            });

            //angular.copy(selected, $scope.selectedNodes);
            
            var trail = getParentTrail(selected[0]);
            $scope.parentTrail = trail.reverse();
            $scope.parentTrail.push(selected[0]);
            if ($scope.allowMultiSelect == true)
            {
                $scope.selectedNodes = selected;
            }
            else{
                $scope.selectedNodes = selected[0];
            }
            if($scope.onSelect)
            {
                $scope.onSelect(node);
            }
          };
          var expand = function(node)
          {
                node.__isExpanded = true;
                node.__isHidden = false;
                //since th4 parent is expanded ensure all its children also visible
                var c = getChildren(node);
                if(c == null){
                    return;
                }
                c.forEach(function(chld){
                        chld.__isHidden =false;
                });
          }

          var expandTo = function(node){
            var parents = getParentTrail(node);
            node.__isHidden = false;
            $scope.parentTrail = parents.reverse();
            $scope.parentTrail.push(node);
            parents.forEach(function(p){
                expand(p);
            });
          };

          var unselectAll = function()
          {
            $scope.flatTree.forEach(function(n){
                n.__isSelected = false;
              });
          }
          
          var setChildrenVisibility = function(node, isHidden, goTillLeaf)
          {
            var children = getChildren(node);
            if(!children)
            {
                return;
            }
            if(children.length < 0)
            {
                return;
            }
            children.forEach(function(n){
                n.__isHidden = isHidden;
                if(goTillLeaf)
                {
                  //check if we are going to open the children , if yes then this node must be expanded
                  node.__isExpanded = !isHidden;
                  setChildrenVisibility(n,isHidden,goTillLeaf);
                }
            });

            
          };
          //get children of this node
          var getChildren = function(node){
            var children = null;
            $scope.flatTree.forEach(function(n){
              if(n.__parent != null && n.__parent == node[options.idAttrib] ){

                  if(children == null){
                      children = [];
                  }
                  children.push(n);
              }
            });
            return children;
          };
            
          //get parent node 
          var getParent = function(node){
            var p = null;
            $scope.flatTree.forEach(function(n){
              if(n[options.idAttrib] && n[options.idAttrib] == node.__parent )
              {
                p=n;
              }
            });
            return p;
          };
          //get all predecessors of this node.
          var getParentTrail = function(node){
            var targetNode = null;

            $scope.flatTree.forEach(function(n){
              if(n[options.idAttrib] && n[options.idAttrib] == node[options.idAttrib])
              {
                targetNode=n;
              }
            });
            
            var parents = [];
            //find parents of the node
            var n = angular.copy(targetNode);
            var proceed = true;
            while(proceed){
                var p = getParent(n)

                if(p){
                    parents.push(p);
                    //now find parent of p;
                    n=angular.copy(p);
                }
                else{
                    proceed = false;
                }
            }
            return parents
          };

          $scope.$watch('tree', function(newValue, oldValue){
              if(newValue)
              {
                  init();
              }
          }, true);
          $scope.$watch('parentTrail', function(newValue, oldValue){
              if(newValue == oldValue)
              {
                  
              }
          });
          $scope.$watchCollection("selectedNodes", function (newValue, oldValue) {
            if (newValue) 
            {
                    //alert('selected changed');
              var ids =  [];
              if(angular.isArray(newValue) ){

              
                    for(var i=0;i<newValue.length;i++){
                        if(newValue[i][options.idAttrib])
                        {
                              var val = newValue[i][options.idAttrib];
                              if(val){
                                ids.push(val.toString());
                              }
                        }
                    }
                   
              }
              else {
                      var val = newValue[options.idAttrib];
                      if(val){
                        ids.push(val.toString());
                         
                      }
              }
              

              if($scope.flatTree)
              {
                $scope.flatTree.forEach(function(n){
                        if(n[options.idAttrib])
                        {
                            var id = n[options.idAttrib].toString();
                            n.__isSelected = ids.indexOf(id) >= 0;
                            if(n.__isSelected){
                                expandTo(n);
                            }    
                        }                    
                });
              }
              
              if ($scope.selectionChanged)
              {
                  $scope.selectionChanged();
              }
            }
              
          });

          
          init();
          
        }]//controller ends
            
      }}
  ]);//directive ends  
    
    
    
})();//closure ends

(function() {
  var module = angular.module('ezDirectives');
  this.viewerTemplate = [
    '<md-button class="md-icon-button" ng-click="openDialog()"  aria-label="close">',
        '<ng-md-icon icon="view"></ng-md-icon> ',
    '</md-button>',
    ].join('\n');

    
    this.viewerDialogTemplate = [
       
          '<md-dialog flex="65" style="height:80vh" aria-label="List dialog">',
             '<md-dialog-content >',
                '<md-toolbar md-scroll-shrink="false">',
                  '<div class="md-toolbar-tools">',
                      '<span flex><span>',
                      '<md-button class="md-icon-button" ng-click="closeDialog()"  aria-label="close">',
                        '<ng-md-icon icon="close"></ng-md-icon> ',
                      '</md-button>',
                  '</div>',
                '</md-toolbar>',
                '<div layout-paddings >',
                  '<div layout="column" layout-align="center center" class="md-whiteframe-1dp">',
                      '<h3>Preiew</h3>',
                      '<div >{{jsonobj | json}}<div>',
                  '</div>',
              '</div>',
             '</md-dialog-content>',
         '</md-dialog>',
    ].join('\n');

    
  module.directive('ezJsonViewer', ['$timeout', 
    function($timeout) {
      return {
        restrict: 'E',
        template: this.viewerTemplate,
        //replace: true,
        scope: {
          jsonobj: '=',
        },
        //controller start
        controller: ["$scope",'$mdDialog', function ($scope,$mdDialog) {
          var init = function(){
            
          }
          
          $scope.$watch('jsonobj', function(newValue, oldValue){
              
          });
          
          $scope.openDialog = function($event){
               var parentEl = angular.element(document.body);
               $mdDialog.show({
                 parent: parentEl,
                 targetEvent: $event,
                 template:viewerDialogTemplate,
                 locals: {
                   jsonobj: $scope.jsonobj,
                 },
                 controller: jsonvwrDialogController
              }).then(function(){
                //$scope.img = dataUrl;
              },function(){

              });
              
              function jsonvwrDialogController($scope, $mdDialog, jsonobj) {
                scope = $scope;
                $scope.jsonobj = jsonobj;
                $scope.closeDialog = function() {
                  $mdDialog.hide();
                }

                $scope.cancelDialog = function() {
                  $mdDialog.cancel();
                }
              }
          }

          
          init();
          
        }]//controller ends
            
      }}
  ]);//directive ends  
    
    
    
})();//closure ends
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
