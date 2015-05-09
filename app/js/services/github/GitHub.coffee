angular.module('app').factory('GitHub', ['$http', ($http) ->

  GITHUB_PROTOCOL = 'https'
  GITHUB_DOMAIN = 'api.github.com'
  HTTP_METHOD_DELETE = 'DELETE'
  HTTP_METHOD_GET = 'GET'
  HTTP_METHOD_PATCH = 'PATCH'
  HTTP_METHOD_POST = 'POST'
  HTTP_METHOD_PUT = 'PUT'

  class User
    constructor: (name, login) ->
      @name = name
      @login = login

  class Gist
    constructor: (id, description, isPublic, files, html_url) ->
      @id = id
      @description = description
      @public = isPublic
      @files = files
      @html_url = html_url

  class Repo
    constructor: (name, description, language, html_url) ->
      @name = name
      @description = description
      @language = language
      @html_url = html_url

  getUser: (token, done) ->
    headers = if (token) then "Authorization": "token #{token}" else {}
    $http(method: HTTP_METHOD_GET, url: "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/user", headers: headers)
    .success (user, status, headers, config) ->
      done(null, new User(user.name, user.login), status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

  getUserRepos: (token, done) ->
    headers = if (token) then "Authorization": "token #{token}" else {}
    $http(method: HTTP_METHOD_GET, url: "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/user/repos", headers: headers)
    .success (repos, status, headers, config) ->
      repos = _.map(repos, (repo) -> new Repo(repo.name, repo.description, repo.language, repo.html_url))
      done(null, repos, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

  getRepoContents: (token, user, repo, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/repos/#{user}/#{repo}/contents"
    $http("method": HTTP_METHOD_GET, "url": url, "headers": Authorization: "token #{token}")
    .success (contents, status, headers, config) ->
      done(null, contents, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

  getPathContents: (token, user, repo, path, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/repos/#{user}/#{repo}/contents"
    if path
      url = "#{url}/#{path}"
    headers = if (token) then "Authorization": "token #{token}" else {}
    $http("method": HTTP_METHOD_GET, "url": url, "headers": headers)
    .success (contents, status, headers, config) ->
      done(null, contents, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

  ###
  The GitHub API uses the same method (PUT) and URL (/repos/:owner/:repo/contents/:path)
  for Creating a file as for updating a file. The key difference is that the update
  requires the blob SHA of the file being replaced. In effect, the existence of the sha
  determines whether the intention is to create a new file or update and existing one.
  ###
  putFile: (token, owner, repo, path, message, content, sha, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/repos/#{owner}/#{repo}/contents/#{path}"
    data = message: message, content: content
    if sha
      data.sha = sha
    headers = if (token) then "Authorization": "token #{token}" else {}
    $http(method: HTTP_METHOD_PUT, url: url, data: data, headers: headers)
    .success (file, status, headers, config) ->
      done(null, file, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

  deleteFile: (token, owner, repo, path, message, sha, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/repos/#{owner}/#{repo}/contents/#{path}"
    data = message: message, sha: sha
    $http(method: HTTP_METHOD_DELETE, url: url, data: data, headers: Authorization: "token #{token}")
    .success (file, status, headers, config) ->
      done(null, file, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

  postRepo: (token, name, description, priv, autoInit, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/user/repos"
    data = name: name, description: description, "private": priv, auto_init: autoInit
    headers = if (token) then "Authorization": "token #{token}" else {}
    $http(method: HTTP_METHOD_POST, url: url, data: data, headers: headers)
    .success (repo, status, headers, config) ->
      done(null, repo, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

  deleteRepo: (token, owner, repo, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/repos/#{owner}/#{repo}"
    $http(method: HTTP_METHOD_DELETE, url: url, headers: Authorization: "token #{token}")
    .success (repo, status, headers, config) ->
      done(null, repo, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

  getGist: (token, id, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/gists/#{id}"
    headers = if (token) then "Authorization": "token #{token}" else {}
    $http("method": HTTP_METHOD_GET, "url": url, "headers": headers)
    .success (contents, status, headers, config) ->
      done(null, contents, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

  patchGist: (token, gistId, data, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/gists/#{gistId}"
    headers = if (token) then "Authorization": "token #{token}" else {}
    $http(method: HTTP_METHOD_PATCH, url: url, data: data, headers: headers)
    .success (file, status, headers, config) ->
      done(null, file, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

  postGist: (token, data, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/gists"
    headers = if (token) then "Authorization": "token #{token}" else {}
    $http(method: HTTP_METHOD_POST, url: url, data: data, headers: headers)
    .success (response, status, headers, config) ->
      done(null, response, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

  deleteGist: (token, owner, id, done) ->
    url = "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/gists/#{id}"
    $http(method: HTTP_METHOD_DELETE, url: url, headers: Authorization: "token #{token}")
    .success (response, status, headers, config) ->
      done(null, response, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

  getUserGists: (token, user, done) ->
    headers = if (token) then "Authorization": "token #{token}" else {}
    $http(method: HTTP_METHOD_GET, url: "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/users/#{user}/gists", headers: headers)
    .success (gists, status, headers, config) ->
      gists = _.map(gists, (gist) -> gist)
      done(null, gists, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)

  getGists: (token, done) ->
    headers = if (token) then "Authorization": "token #{token}" else {}
    $http(method: HTTP_METHOD_GET, url: "#{GITHUB_PROTOCOL}://#{GITHUB_DOMAIN}/gists", headers: headers)
    .success (gists, status, headers, config) ->
      console.log
      gists = _.map(gists, (gist) -> new Gist(gist.id, gist.description, gist.public, gist.files, gist.html_url))
      done(null, gists, status, headers, config)
    .error (response, status, headers, config) ->
      done(new Error(response.message), response, status, headers, config)
])
