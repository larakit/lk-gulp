(function () {
    angular
    .module('larakit')
    .config(['$locationProvider', '$routeProvider', '$translateProvider',
        function config($locationProvider, $routeProvider, $translateProvider) {
            $locationProvider.html5Mode(true);
            
            /*translate*/
            
            $routeProvider
            .otherwise('/*otherwise*/');
            
            
            /* ################################################## */
            /*                      ROUTES START                  */
            /* ################################################## */
            /*routes*/
            /* ################################################## */
            /*                      ROUTES END                    */
            /* ################################################## */
            
        }
    ]).run(function ($rootScope, LkSidebars) {
        $rootScope.rightToggle = function () {
            LkSidebars.rightToggle();
            return false;
        };
        $rootScope.rightValue = function () {
            return LkSidebars.rightValue();
        };
        $rootScope.leftToggle = function () {
            LkSidebars.leftToggle();
            return false;
        };
        $rootScope.leftValue = function () {
            return LkSidebars.leftValue();
        };
    });
})();