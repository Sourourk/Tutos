var app=angular.module('myapp',[]);
app.controller('myCtrl', function($http,$scope)
		{
		
		$scope.afficher=function(){
		$http.get('listeetudiantsJSON.php')
		  .success(function(response){
                    $scope.etudiants=[];
		    console.log(response);
		   $scope.etudiants.push(response);
		  });}
		})
