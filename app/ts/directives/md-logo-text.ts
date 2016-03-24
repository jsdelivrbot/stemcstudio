import app from '../app';

app.directive('mdLogoText', function() {
  return {
    restrict: 'E',
    // Can't make this an isolated scope because of the use of version.
    templateUrl: 'md-logo-text.html'
  };
});
