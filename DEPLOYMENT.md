# Deployment

## Introduction

STEMCstudio is currently deployed on Heroku.

STEMCstudio is the marketing name. All engineering names are lower case.

## Heroku Application Settings

Heroku Account: geometryzen@gmail.com

Heroku domain: stemcstudio.herokuapp.com

Heroku Git URL: https://git.heroku.com/stemstudio.git

Buildpack: heroku/nodejs

## Heroku Custom Domains:

stemcstudio.com => stemcstudio.herokuapp.com
www.stemcstudio.com => stemcstudio.herokuapp.com

## Heroku Config Variables

GITHUB_APPLICATION_CLIENT_ID

GITHUB_APPLICATION_SECRET

NODE_ENV => production

## Application Constants

### GITHUB_KEY

This is defined in `views/github_callback.jade`

"com.stemcstudio.github"

### GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME

This is defined in `app/ts/app.ts` and `app/ts/controllers/LoginController.ts`

TODO: Need to DRY this!

"stemcstudio-github-application-client-id"

## Development

The file `config.development.json` defines the GitHub *Client ID* and *Client Secret*.
The file `config.example.json` is not actually used because of the Heroku Config Variables.

## Developer (OAuth) applications

These are set up in the `david.geo.holmes@gmail.com` GitHub account.

There are two (2) Developer applications, one for development, the other for production.

### development

Name: `STEMCstudio Local`

Homepage URL: http://localhost:8080

Description: Educational Computational Mathematics, Physics, Modeling and Geometry

Authorization callback URL: http://localhost:8080/github_callback

Copy the *Client ID* and *Client Secret* into the file `config.development.json`

### production

Name: `STEMCstudio`

Homepage URL: http://www.stemcstudio.com

Description: Educational Computational Mathematics, Physics, Modeling and Geometry

Authorization callback URL: http://www.stemcstudio.com/github_callback

Copy the *Client ID* and *Client Secret* into the appropriate Heroku Config Variables.

### Git remote(s)

The command

```
git remote -v
```
should show repositories for GitHub `origin` and `heroku`.

Ensure the `heroku` repository using

```
git remote add heroku git@heroku.com:stemcstudio.git
```

### Pushing to Heroku (Git Deploy)

```
git push -f heroku master
```

