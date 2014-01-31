var app = angular.module('app',[]);

app.controller('timerController',function($scope,$timeout){

    $scope.now;
    $scope.animate = false;
    $scope.beep = false;

    $scope.waitFor = 10;

    //Uptime
    $scope.maxMinutes = 0;
    $scope.maxSeconds = 0;

    var begin;
    $scope.timeoutId;

    $scope.oMinutes = new Array();
    $scope.oSeconds = new Array();
    for (var i=0;i<100;i++){
        $scope.oMinutes[i] = i;
        if (i<60)
            $scope.oSeconds[i] = i;
    }

    $scope.start = function(){
        
        $scope.minutes = "00";
        $scope.seconds = "00";
        $scope.milliseconds = "00";
        var selectedProgram = $scope.selectedProgram;
        var waitFor = parseInt($scope.waitFor,10);
        
        $scope.timeoutId = setInterval(function(){
            $scope.selectedProgram = waitFor;
            waitFor -= 1;
            if (waitFor === 0){
                $scope.selectedProgram = selectedProgram;
                clearInterval($scope.timeoutId);
            }
        },995);

        $timeout(function(){
            if ($scope.program === 1){
            begin = new Date();
            $scope.timeoutId = setInterval(function(){
                var now = new Date(new Date().getTime() - begin.getTime());
                $scope.$apply(function(){
                    $scope.now = now;
                });
            },64);
        }
        }, waitFor * 1000);

        
    };

    $scope.stop = function(){
        $scope.animate = true;
        clearInterval($scope.timeoutId);
        $timeout(function(){$scope.timeoutId = 0;},1000);
        
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
        
        scope.minutes = "00";
        scope.seconds = "00";
        scope.milliseconds = "00";

        var minutes;
        var seconds;
        var maxMinutes;
        var maxSeconds;

        scope.$watch('now',function(){

            $(element).clearQueue();
            $(element).fadeIn(500);

            /*scope.hours = scope.now.getUTCHours() < 10 ? 
            "0" + scope.now.getUTCHours() : 
            scope.now.getUTCHours();*/

            scope.minutes = scope.now.getUTCMinutes() < 10 ?
            "0" + scope.now.getUTCMinutes() :
            scope.now.getUTCMinutes();

            scope.seconds = scope.now.getUTCSeconds() < 10 ?
            "0" + scope.now.getUTCSeconds() :
            scope.now.getUTCSeconds();

            scope.milliseconds = scope.now.getUTCMilliseconds().toString().substr(0,2);

            //Uptime and minutes and seconds are equals to max values
            minutes = parseInt(scope.minutes,10);
            seconds = parseInt(scope.seconds,10);

            if ((minutes === 0  && seconds > 0) || minutes > 0){

                maxMinutes = parseInt(scope.maxMinutes,10);
                maxSeconds = parseInt(scope.maxSeconds,10);

               //Program 1 - Up
               if (scope.program === 1 &&
                ((minutes === maxMinutes && seconds === maxSeconds) ||
                (minutes === 99 && seconds === 59))){
                    
                    scope.milliseconds = 
                        (minutes === 99 && seconds === 59) ?
                            "99":
                            "00";

                    scope.beep = true;
                    scope.stop();
                }
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
        templateUrl: "clock.html"
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