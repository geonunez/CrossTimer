var app = angular.module('app',[]);

app.controller('timerController',function($scope,$timeout){

    $scope.now;
    $scope.animate = false;

    var begin;
    $scope.timeoutId;

    $scope.start = function(){
        if ($scope.program === 1){
            begin = new Date();
            $scope.timeoutId = setInterval(function(){
                $scope.$apply(function(){
                    $scope.now = 
                    new Date(new Date().getTime() - begin.getTime());
                });
            },1000);
        }
    };

    $scope.stop = function(){
        $scope.animate = true;
        clearInterval($scope.timeoutId);
        $timeout(function(){$scope.timeoutId = 0;},500);
    };

    $scope.changeProgram = function(program){
        $scope.program = program;
    }
});

app.directive("clock",function(){

    function link(scope,element,attrs){
        scope.hours = "00";
        scope.minutes = "00";
        scope.seconds = "00";

        scope.$watch('now',function(){

            $(element).clearQueue();
            $(element).fadeIn(500);

            scope.hours = scope.now.getUTCHours() < 10 ? 
            "0" + scope.now.getUTCHours() : 
            scope.now.getUTCHours();

            scope.minutes = scope.now.getUTCMinutes() < 10 ?
            "0" + scope.now.getUTCMinutes() :
            scope.now.getUTCMinutes();

            scope.seconds = scope.now.getUTCSeconds() < 10 ?
            "0" + scope.now.getUTCSeconds() :
            scope.now.getUTCSeconds();
        });

        scope.$watch('animate',function(){
            if (scope.animate){
                if(scope.timeoutId > 0){
                    for (var i = 0; i<3;i++){
                        $(element).fadeOut(500);
                        $(element).fadeIn(500);
                    }
                }
                scope.animate = false;
            }
        });
    };

    return {
        link : link,
        restrict: "E",
        template: "{{hours}} : {{minutes}}  : {{seconds}}"
    };
});

app.directive('program',function(){

    function link(scope, element, attrs){
        scope.program = 1;
        scope.selectedProgram = "Up";

        scope.$watch('program',function(){
            if (scope.program === 3){
                scope.selectedProgram = "H";
            }
            else if (scope.program === 2){
                scope.selectedProgram = "Dn";
            }
            else if (scope.program === 1){
                scope.selectedProgram = "Up";
            }
        });
    };

    return {
        link: link,
        restrict: 'E',
        template: "{{selectedProgram}}"
    };
});

app.directive('timepicker', function(){

    function link (scope, element, attrs){

    };

    return {
        link : link,
        restrict: 'E',
        template: "<span class='glyphicon glyphicon-star'></span>"
    };
});