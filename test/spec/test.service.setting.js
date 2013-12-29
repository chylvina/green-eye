'use strict';

describe('service.setting', function() {
  var appSetting, $httpBackend, $rootScope;

  beforeEach(module('service.setting'));

  //beforeEach();

  it('should work', function() {
    inject(function($injector) {
      $injector.get('appSetting');
      /*appSetting = $injector.get('appSetting');
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');*/
    })

    expect(1).toBe(1);
  });
});