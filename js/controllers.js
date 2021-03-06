var app = angular.module('app',[]);

app.controller('timerController',function($scope,$timeout){

    /** Attributes **/

    $scope.waitFor = 1; //Seconds
    $scope.animate = false; //Indicate if the timer has to blink
    $scope.beep = false; //Indicate if the timer has to beep
    $scope.maxMinutes = 0; //Indicate the max minutes when the timer is upping
    $scope.maxSeconds = 0; //Indicate the max seconds when the timer is upping
    $scope.now;
    $scope.idTimerInteval; //Timer Interval's id
    $scope.idWaitForInteval; //Timer Interval's id
    $scope.isRunnig = false; //Indicate if the timer is running
    

    $scope.oMinutes = new Array();
    $scope.oSeconds = new Array();
    for (var i=0;i<100;i++){
        $scope.oMinutes[i] = i;
        if (i<60) $scope.oSeconds[i] = i;
    }

    /** Public methods **/

    $scope.start = function(){  
        if (!$scope.isRunnig){
            resetTimer();
            var waitFor = parseInt($scope.waitFor,10);
            //Interval for the countdown before start
            $scope.idWaitForInteval = setInterval(function(){
                countdownBeforeStart(waitFor);
                waitFor -= 1;
            },1000);
            //Wait for the countdown before start
            $timeout(function(){
                startTimer();
            }, (waitFor + 1) * 1000);
        }
    };

    $scope.stop = function(){
        if ($scope.isRunnig){
            $scope.animate = true;
            clearInterval($scope.idTimerInteval);
            if ($scope.beep){
                beepDouble();
                $scope.beep = false;
            }
            $scope.isRunnig = false;
        }
    };

    $scope.changeProgram = function(program){
        $scope.program = program;
    }
    
    /** Private methods **/

    function startTimer(){
        $scope.isRunnig = true;
        //Up Timer
        if ($scope.program === $scope.getUpProgram()){
            var begin = new Date();
            $scope.idTimerInteval = setInterval(function(){
                var now = new Date(new Date().getTime() - begin.getTime());
                $scope.$apply(function(){
                    $scope.now = now;
                });
            },64);
        }
    }

    function resetTimer(){
        $scope.minutes = "00";
        $scope.seconds = "00";
        $scope.milliseconds = "00";
    }

    function beep(){
        var audio = document.getElementById("beep");
            audio.load();
            audio.play();
    }

    function beepBig(){
        var audio = document.getElementById("beepBig");
            audio.load();
            audio.play();
    }

    function beepDouble(){
        var audio = document.getElementById("beepDouble");
            audio.load();
            audio.play();
    }

    function countdownBeforeStart(waitFor){
        //Shows the counter
        $scope.$apply(function(){
            if (waitFor !== 0)
                $scope.selectedProgram = waitFor;
        });
        // Beeps in 3, 2 and 1
        if (4>waitFor && waitFor>0)
            beep();
        //Restore selected program and clear the inteval
        else if (waitFor === 0){
            beepBig();
            $scope.$apply(function(){
                $scope.selectedProgram = $scope.programNames[$scope.program];
            });
            clearInterval($scope.idWaitForInteval);
        }
    }
});

app.directive('program',function(){

    function link($scope, element, attrs){
        
        $scope.getUpProgram = function(){return 0;};
        $scope.getDownProgram = function(){return 1;};
        $scope.getIntervalProgram = function(){return 2;};

        $scope.programNames = ["Up","Dn","H"];
        $scope.program = $scope.getUpProgram();
        $scope.selectedProgram = $scope.programNames[$scope.program];

        $scope.$watch('program',function(){
            $scope.programNames[$scope.program];
        });
    };

    return {
        link: link,
        restrict: 'E',
        template: "{{selectedProgram}}"
    };
});

app.directive("clock",function(){

    function link($scope,element,attrs){
        
        $scope.minutes = "00";
        $scope.seconds = "00";
        $scope.milliseconds = "00";

        var minutes;
        var seconds;
        var maxMinutes;
        var maxSeconds;

        $scope.$watch('now',function(){

            $(element).clearQueue();
            $(element).fadeIn(500);

            if (typeof $scope.now == "object"){

                $scope.minutes = $scope.now.getUTCHours() == 0  && $scope.now.getUTCMinutes() < 10 ?
                "0" + $scope.now.getUTCMinutes() :
                $scope.now.getUTCHours() == 0 ?
                $scope.now.getUTCMinutes() : 
                60 + $scope.now.getUTCMinutes();

                $scope.seconds = $scope.now.getUTCSeconds() < 10 ?
                "0" + $scope.now.getUTCSeconds() :
                $scope.now.getUTCSeconds();

                $scope.milliseconds = $scope.now.getUTCMilliseconds().toString().substr(0,2);

                //Uptime and minutes and seconds are equals to max values
                minutes = parseInt($scope.minutes,10);
                seconds = parseInt($scope.seconds,10);

                if ((minutes === 0  && seconds > 0) || minutes > 0){

                    maxMinutes = parseInt($scope.maxMinutes,10);
                    maxSeconds = parseInt($scope.maxSeconds,10);

                   //Program 1 - Up
                   if ($scope.program === $scope.getUpProgram() &&
                    ((minutes === maxMinutes && seconds === maxSeconds) ||
                    (minutes === 99 && seconds === 59))){
                        
                        $scope.milliseconds = 
                            (minutes === 99 && seconds === 59) ?
                                "99":
                                "00";

                        $scope.beep = true;
                        $scope.stop();
                    }
                }
            }
        });

        $scope.$watch('animate',function(){
            if ($scope.animate){
                if($scope.idTimerInteval > 0){
                    for (var i = 0; i<3;i++){
                        $(element).fadeOut(500);
                        $(element).fadeIn(500);
                    }
                }
                $scope.animate = false;
            }
        });
    };

    return {
        link : link,
        restrict: "E",
        templateUrl: "clock.html"
    };
});
