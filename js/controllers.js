var app = angular.module('app',[]);

app.controller('timerController',function($scope,$timeout){

    $scope.now;
    $scope.animate = false;
    $scope.beep = false;

    //Uptime
    $scope.maxMinutes = 0;
    $scope.maxSeconds = 0;

    var begin;
    $scope.timeoutId;

    $scope.start = function(){
        console.log("Program:" + $scope.program + ", Max minutes: " + $scope.maxMinutes + ", Max seconds:" + $scope.maxSeconds);
        if ($scope.program === 1){
            begin = new Date();
            $scope.timeoutId = setInterval(function(){
                var now = new Date(new Date().getTime() - begin.getTime());
                $scope.$apply(function(){
                    $scope.now = now;
                });
            },1000);
        }
    };

    $scope.stop = function(){
        $scope.animate = true;
        clearInterval($scope.timeoutId);
        $timeout(function(){$scope.timeoutId = 0;},500);
        
        if ($scope.beep){
            var audio = document.getElementById("beep");
            audio.load();
            audio.play();
            $scope.beep = false;
        }
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

            //Uptime and minutes and seconds are equals to max values
            if (scope.program == 1 &&
                scope.minutes == scope.maxMinutes &&
                scope.seconds == scope.maxSeconds)
            {
                scope.beep = true;
                scope.stop();
            }
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
        templateUrl: 'timePicker.html'
    };
});

app.directive('', ['', function(){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        // template: '',
        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {
            
        }
    };
}]);