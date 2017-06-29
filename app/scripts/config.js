    'use strict';
    function AppConfig(){
        this.appModuleName = 'jApp';
        this.appModuleDependencies = [
            'ngAnimate','ngAria','ngCookies','ngMessages','ngResource','ngRoute',
            'ngSanitize','ngStorage','ngTouch','ngFileUpload','720kb.datepicker',
            'ui.calendar','angular-cache','angular.filter','ui.grid',
            'ui.grid.selection','ui.grid.exporter','ui.grid.moveColumns',
            'ui.grid.pagination','ui.grid.autoResize','ui.bootstrap',
            //'ngMaterial',
        ];
        this.appVersion = '1.0.0';
        this.appTitle = 'ABC';
        this.appCopyright = 'JDev Artwork';
        this.apiServerUrl = 'http://chms-server/api/v1/';
    }
