module = angular.module('app')
# This service is used to handle the redirect from GitHub authentication and authorization.
#
# If the GitHub redirect occurs normally then we call our Gatekeeper HTTP service to
# exchange the session code for an authentication token.
#
# If the user denies access then we cleanup.
module.service('GitHubAuthManager', ['$http', '$location', '$window', 'cookie', 'GitHub', ($http, $location, $window, cookie, github) ->
  @handleLoginCallback = (done) ->

    # The Gatekeeper is being served from the same server as this code.
    GATEKEEPER_DOMAIN = "#{$location.protocol()}://#{$location.host()}:#{$location.port()}"

    # TODO: This symbolic constant also appears in the GitHub service (DRY).
    GITHUB_TOKEN_COOKIE_NAME = 'github-token'
    GITHUB_LOGIN_COOKIE_NAME = 'github-login'

    # Trap OAuth Application callback from GitHub. Note that the HTTP call is actually asynchronous.
    match = $window.location.href.match(/\?code=([a-z0-9]*)/)
    if match
      # We've scraped the code from the URL so let's clear the URL now, synchronously.
      # If we wait till later and do it in an async callback then it will not change. 
      $location.search({})
      code = match[1]
      # regex = new RegExp("\\?code=#{code}")
      # Using the Gatekeeper a proxy, exchange the session code for an auth token.
      # Note: The token should be treated like a password.
      # Therefore, the communication with the Gatekeeper should be secure and
      # the token should not be left laying around in cookies or local storage.
      # e.g use HTTPS and set the "secure" flag on auth cookies.
      $http.get("#{GATEKEEPER_DOMAIN}/authenticate/#{code}")
      .success (data, status, headers, config) ->
        # Here we chop of the extra, but we could go fetch the user using the auth token then
        # redirect to our own /users/:user.
        # Also, lets not have the library making the decision.
        token = data.token
        # TODO: We should at least make this a secure token or something.
        # Currently, setting the cookie item is used to record the authentication state.
        cookie.setItem(GITHUB_TOKEN_COOKIE_NAME, token)
        # Here is the second asynchronous request.
        github.getUser token, (error, user) ->
          if not error
            cookie.setItem(GITHUB_LOGIN_COOKIE_NAME, user.login)
            done(null, token)
          else
            # Note, we do have the auth token so it could be that we don't actually need the user login.
            done new Error "Unable to retrieve your user information."
      .error (data, status, headers, config) ->
        done new Error "Unable to retrieve your authentication token."

    # If the user denies authorization to this application, clean up the browser URL.
    else if $window.location.href.match(/\?error=access_denied/)
      $location.search({})
])
