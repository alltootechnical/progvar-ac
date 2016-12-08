var app = angular.module('myApp', []);

function PageCtrl($scope, $http, $interval) {
    // var users = ['vjudge1', 'vjudge2', 'vjudge3'];
    // var users = ['vjudge1', 'vjudge2', 'vjudge3', 'vjudge4', 'vjudge5', 'vjudge6', 'vjudge7', 'vjudge8', 'vjudge9', 'vjudge10'];
    // var uid = [159396, 159397, 159398];
    // var uid2 = [38026, 38027, 38028];

    $scope.teamdb = [
        {name: "Fuchsia Moth", cf: ['Hikari9', 'kylesky', 'derpidc'], uva: [195293, 192126, 187790], la: [63294, 83563, 64883]},
        {name: "Möbius", cf: ['PPTGamer', 'loanedstar', 'ALoremia'], uva: [240019, 194646, 268802], la: [120500, 216195, 117252]},
        {name: "ABL Tree", cf: ['alltootechnical', 'luisligunas', 'dTanMAn'], uva: [774905, 795918, 265163], la: [195959, 195950, 117246]},
        {name: "NSF Mangoes", cf: ['vaan252', 'NateTheGreat', 'theSardonyx'], uva: [295447, 795938, 268819], la: [165746, 195951]}
    ];

    $scope.currTeam = 0;
    $scope.teamName = "";
    $scope.done = 0;


    var r1 = false, r2 = false, r3 = false;
    var firstrun = true;
    var vermap = {
        undefined: "Pending",
        "FAILED": "Failed",
        "OK": "Accepted",
        "PARTIAL": "Partial",
        "COMPILATION_ERROR": "Compile error",
        "RUNTIME_ERROR": "Runtime error",
        "WRONG_ANSWER": "Wrong answer",
        "PRESENTATION_ERROR": "Presentation error",
        "TIME_LIMIT_EXCEEDED": "Time limit exceeded",
        "MEMORY_LIMIT_EXCEEDED": "Memory limit exceeded",
        "IDLENESS_LIMIT_EXCEEDED": "Idleness limit exceeded",
        "SECURITY_VIOLATED": "Security violated",
        "CRASHED": "Crashed",
        "INPUT_PREPARATION_CRASHED": "Input prep crashed",
        "CHALLENGED": "Hacked",
        "SKIPPED": "Skipped",
        "TESTING": "Pending",
        "REJECTED": "Rejected",
        0: "Pending",
       10: "Submission error",
       15: "Can't be judged",
       20: "Pending",
       30: "Compile error",
       35: "Restricted function",
       40: "Runtime error",
       45: "Output limit exceeded",
       50: "Time limit exceeded",
       60: "Memory limit exceeded",
       70: "Wrong answer",
       80: "Presentation error",
       90: "Accepted",
    };

    $scope.res = [{}, {}, {}, {}, {}, {}, {}, {}, {}];
    var tmp = [];
    $scope.UVaprobs = {};
    $scope.LAprobs = {};

    $scope.latestUT = 0, $scope.latestIdx = -1;
    $scope.latest = {};

    $scope.showDebugTable = false;

    $scope.loadProbs = function() {
        $http.get("https://cors-anywhere.herokuapp.com/http://uhunt.felix-halim.net/api/p").success(function(data, status) {
            for (var i = 0; i < data.length; i++) {
                $scope.UVaprobs[data[i][0]] = {num: data[i][1], title: data[i][2]};
                //console.log($scope.UVaprobs[data[i][0]]);
            }
            $scope.loadUVa();
        });
        $http.get("laprobs.js").success(function(data, status) {
            for (var i = 0; i < data.length; i++) {
                $scope.LAprobs[data[i][0]] = {num: data[i][1], title: data[i][2]};
                //console.log($scope.LAprobs[data[i][0]]);
            }
            $scope.loadLA();
        });
    }

    $scope.loadCF = function() {
        $http.get('https://cors-anywhere.herokuapp.com/http://codeforces.com/api/user.status?handle=' + $scope.teamdb[$scope.currTeam].cf[0] + '&count=1').success(function(data, status) {
            var t = data.result[0];
            $scope.res[0] = {
                "name": t.author.members[0].handle,
                "time": t.creationTimeSeconds,
                "verdict": vermap[t.verdict],
                "problem": "CF " + t.problem.contestId + t.problem.index + ": " + t.problem.name
            };
            if ($scope.latestUT < t.creationTimeSeconds) {
                $scope.latestUT = t.creationTimeSeconds;
                $scope.latestIdx = 0;
            }
            $scope.done++;
        });

        $http.get('https://cors-anywhere.herokuapp.com/http://codeforces.com/api/user.status?handle=' + $scope.teamdb[$scope.currTeam].cf[1] + '&count=1').success(function(data, status) {
            var t = data.result[0];
            $scope.res[1] = {
                "name": t.author.members[0].handle,
                "time": t.creationTimeSeconds,
                "verdict": vermap[t.verdict],
                "problem": "CF " + t.problem.contestId + t.problem.index + ": " + t.problem.name
            };
            if ($scope.latestUT < t.creationTimeSeconds) {
                $scope.latestUT = t.creationTimeSeconds;
                $scope.latestIdx = 1;
            }
            $scope.done++;
        });

        $http.get('https://cors-anywhere.herokuapp.com/http://codeforces.com/api/user.status?handle=' + $scope.teamdb[$scope.currTeam].cf[2] + '&count=1').success(function(data, status) {
            var t = data.result[0];
            $scope.res[2] = {
                "name": t.author.members[0].handle,
                "time": t.creationTimeSeconds,
                "verdict": vermap[t.verdict],
                "problem": "CF " + t.problem.contestId + t.problem.index + ": " + t.problem.name
            };
            if ($scope.latestUT < t.creationTimeSeconds) {
                $scope.latestUT = t.creationTimeSeconds;
                $scope.latestIdx = 2;
            }
            $scope.done++;
        });

        // for (var i = 0; i < users.length; i++) {
        //     $http.get('http://codeforces.com/api/user.status?handle=' + users[i] + '&count=1').success(function(data, status) {
        //         var t = data.result[0];
        //         if ($scope.latestUT < t.creationTimeSeconds) {
        //             $scope.latestUT = t.creationTimeSeconds;
        //             $scope.latest = {
        //                 "name": t.author.members[0].handle,
        //                 "time": t.creationTimeSeconds,
        //                 "verdict": vermap[t.verdict],
        //                 "problem": "CF " + t.problem.contestId + t.problem.index + ": " + t.problem.name
        //             };
        //         }
        //     });
        // }
        r1 = true;
    };


    $scope.loadUVa = function() {
        $http.get('https://cors-anywhere.herokuapp.com/http://uhunt.felix-halim.net/api/subs-user-last/' + $scope.teamdb[$scope.currTeam].uva[0] + '/1').success(function(data, status) {
            var t = data.subs[0];
            $scope.res[0 + 3] = {
                "name": data.name + " (" + data.uname + ")",
                "time": t[4],
                "verdict": vermap[t[2]],
                "problem": "UVa " + $scope.UVaprobs[t[1]].num + ": " + $scope.UVaprobs[t[1]].title
            };
            if ($scope.latestUT < t[4]) {
                $scope.latestUT = t[4];
                $scope.latestIdx = 3;
            }
            $scope.done++;
        });
        $http.get('https://cors-anywhere.herokuapp.com/http://uhunt.felix-halim.net/api/subs-user-last/' + $scope.teamdb[$scope.currTeam].uva[1] + '/1').success(function(data, status) {
            var t = data.subs[0];
            $scope.res[1 + 3] = {
                "name": data.name + " (" + data.uname + ")",
                "time": t[4],
                "verdict": vermap[t[2]],
                "problem": "UVa " + $scope.UVaprobs[t[1]].num + ": " + $scope.UVaprobs[t[1]].title
            };
            if ($scope.latestUT < t[4]) {
                $scope.latestUT = t[4];
                $scope.latestIdx = 4;
            }
            $scope.done++;
        });
        $http.get('https://cors-anywhere.herokuapp.com/http://uhunt.felix-halim.net/api/subs-user-last/' + $scope.teamdb[$scope.currTeam].uva[2] + '/1').success(function(data, status) {
            var t = data.subs[0];
            $scope.res[2 + 3] = {
                "name": data.name + " (" + data.uname + ")",
                "time": t[4],
                "verdict": vermap[t[2]],
                "problem": "UVa " + $scope.UVaprobs[t[1]].num + ": " + $scope.UVaprobs[t[1]].title
            };
            if ($scope.latestUT < t[4]) {
                $scope.latestUT = t[4];
                $scope.latestIdx = 5;
            }
            $scope.done++;
        });
        // for (var i = 0; i < uid.length; i++) {
        //     $http.get('http://uhunt.felix-halim.net/api/subs-user-last/' + uid[i] + '/1').success(function(data, status) {
        //         var t = data.subs[0];
        //         if ($scope.latestUT < t[4]) {
        //             $scope.latestUT = t[4];
        //             $scope.latest = {
        //                 "name": data.name + " (" + data.uname + ")",
        //                 "time": t[4],
        //                 "verdict": vermap[t[2]],
        //                 "problem": "UVa " + $scope.UVaprobs[t[1]].num + ": " + $scope.UVaprobs[t[1]].title
        //             };
        //         }
        //     });
        // }
        r2 = true;
    };

    $scope.loadLA = function() {
        $http.get('https://icpcarchive.ecs.baylor.edu/uhunt/api/subs-user-last/' + $scope.teamdb[$scope.currTeam].la[0] + '/1').success(function(data, status) {
            var t = data.subs[0];
            $scope.res[0 + 6] = {
                "name": data.name + " (" + data.uname + ")",
                "time": t[4],
                "verdict": vermap[t[2]],
                "problem": "LA " + $scope.LAprobs[t[1]].num + ": " + $scope.LAprobs[t[1]].title
            };
            if ($scope.latestUT < t[4]) {
                $scope.latestUT = t[4];
                $scope.latestIdx = 6;
            }
            $scope.done++;
        });
        $http.get('https://icpcarchive.ecs.baylor.edu/uhunt/api/subs-user-last/' + $scope.teamdb[$scope.currTeam].la[1] + '/1').success(function(data, status) {
            var t = data.subs[0];
            $scope.res[1 + 6] = {
                "name": data.name + " (" + data.uname + ")",
                "time": t[4],
                "verdict": vermap[t[2]],
                "problem": "LA " + $scope.LAprobs[t[1]].num + ": " + $scope.LAprobs[t[1]].title
            };
            if ($scope.latestUT < t[4]) {
                $scope.latestUT = t[4];
                $scope.latestIdx = 7;
            }
            $scope.done++;
        });
        $http.get('https://icpcarchive.ecs.baylor.edu/uhunt/api/subs-user-last/' + $scope.teamdb[$scope.currTeam].la[2] + '/1').success(function(data, status) {
            var t = data.subs[0];
            $scope.res[2 + 6] = {
                "name": data.name + " (" + data.uname + ")",
                "time": t[4],
                "verdict": vermap[t[2]],
                "problem": "LA " + $scope.LAprobs[t[1]].num + ": " + $scope.LAprobs[t[1]].title
            };
            if ($scope.latestUT < t[4]) {
                $scope.latestUT = t[4];
                $scope.latestIdx = 8;
            }
            $scope.done++;
        });

        // for (var i = 0; i < uid2.length; i++) {
        //     $http.get('https://icpcarchive.ecs.baylor.edu/uhunt/api/subs-user-last/' + uid2[i] + '/1').success(function(data, status) {
        //         var t = data.subs[0];
        //         if ($scope.latestUT < t[4]) {
        //             $scope.latestUT = t[4];
        //             $scope.latest = {
        //                 "name": data.name + " (" + data.uname + ")",
        //                 "time": t[4],
        //                 "verdict": vermap[t[2]],
        //                 "problem": "LA " + $scope.LAprobs[t[1]].num + ": " + $scope.LAprobs[t[1]].title
        //             };
        //         }
        //     });
        // }
        r3 = true;
    };

    $scope.refresh = function() {
        $scope.loadProbs();
        $scope.loadCF();
    }

    $scope.thingy = function() {
        $scope.teamName = $scope.teamdb[$scope.currTeam].name;
        $scope.loadCF();
        $scope.loadUVa();
        $scope.loadLA();
    }

    $scope.toggleDebugTable = function() {
        $scope.showDebugTable = !$scope.showDebugTable;
    }

    $scope.switchTeam = function(i) {
        $scope.currTeam = i;
        $scope.done = 0;
        $scope.res = [{}, {}, {}, {}, {}, {}, {}, {}, {}];
        $scope.thingy();
    }

    $interval(function () {
        $scope.thingy();
        // if (firstrun) {tmp = $scope.res; firstrun = false}
        // else {
        //     if (angular.toJson($scope.res) !== angular.toJson(tmp)) {
        //         $scope.thingy;
        //         console.log('updating');
        //     }
        // }
        // tmp = $scope.res;
        // console.log('will update');
    }, 5000);
}
