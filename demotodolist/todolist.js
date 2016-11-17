
var app = angular.module("myApp", ["ngRoute", "firebase"]);
app.run(function() {
})

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "main.htm"
    })
    .when("/edittodo/:uniquekey", {
        templateUrl : "edittodo.htm",
        controller : "editTODOCtrl"
    })
});
app.controller("newTODOCtrl", function($scope) {
    $scope.steps = [];
    $scope.addStep = function () {
        $scope.steps.push($scope.newStep);
        $scope.newStep = "";
    }
    $scope.removeStep = function (x) {
        $scope.steps.splice(x, 1);
    }
});
app.constant({fireBaseUrl: 'https://demotodolist-ff08f.firebaseio.com/'});
app.controller('editTODOCtrl',function($scope,$routeParams){
    $scope.todolistkey= $routeParams.uniquekey;

});

app.controller('showTODOLists', function($scope , $timeout, $routeParams,  fireBaseUrl,  $firebase ) {
        

        
        var param = $routeParams.uniquekey;
        console.log(param);
        var ref = new Firebase(fireBaseUrl);
        PrintTODO(param);       
        

        function PrintTODO(param){
	        if (param){
	        		ref.child('records').orderByChild('key').equalTo(param).once('value', function(snapshot){
						$timeout(function() {
							$scope.groups = snapshot.val();
							return snapshot.val();
						});			            
				     });        	
	        }
	        else {
	        	datas = $firebase(ref.child('records'));
	        	$scope.groups = datas;
	        }
	    }


        $scope.removeItem = function(step){
			ref.child('records').orderByChild('key').equalTo(param).once('value', function(snapshot){
				$timeout(function() {
					snapshot.forEach(function(snap){
						snap.ref().child('todolist').orderByChild('step').equalTo(step).once('value', function(snapshotRem){
							$timeout(function() {
								snapshotRem.forEach(function(sn){
									sn.ref().remove();
								});
								PrintTODO(param);
							});
						});
					});
					
				});			            
		    });

		};        

		
		$scope.addItem = function(step, act){
			ref.child('records').orderByChild('key').equalTo(param).once('child_added', function(snapshot){
				$timeout(function() {
					var newObj = {"step":step,"act":act};
					snapshot.ref().child('todolist').push(newObj);
					$scope.newStep = "";
					$scope.newDo = "";
					PrintTODO(param);
				});			            
		     });
		};


        $scope.removeTODO = function(key) {
            ref.child('records').orderByChild('key').equalTo(key).once('value', function(snapshot){
				$timeout(function() {
					snapshot.forEach(function(sn){
								sn.ref().remove();
					});
					PrintTODO(param);
				});			            
		    });
        }; 

        $scope.addTODOList = function(key){
			var item = {"key":key,"todolist":[]};
			$scope.groups.$add(item).then(function(p){
        		console.log(key);
        		$scope.newKey = "";
        		PrintTODO(param);
        	});	        
        };       

    });