describe("HomeController", function() {

  beforeEach(function() {
    module("app");
  });

  beforeEach(inject(function($controller, $rootScope, $location, $httpBackend) {
    this.$location = $location;
    this.$httpBackend = $httpBackend;
    this.scope = $rootScope.$new();
    this.redirect = spyOn($location, 'path');
    $controller('HomeController', {
      $scope: this.scope,
      $location: $location
    });
  }));

  afterEach(function() {
    this.$httpBackend.verifyNoOutstandingRequest();
    this.$httpBackend.verifyNoOutstandingExpectation();
  });

  describe("successfully doing something", function() {
    it("should have a certain result", function() {
//    this.$httpBackend.expectPOST('/login', this.scope.credentials).respond(200);
//    this.$httpBackend.flush();
//    expect(this.redirect).toHaveBeenCalledWith('/home');
    });
  });
});
