# ProjectName

A starter project template for creating new projects using nodejs, express, connect-mongo (sessions saved in mongodb), ejs view engine, and passport-local.

## using this template

Edit the package.json with your new project name/info.

semver override in package.json is because there's new vulnerbilities that aren't patched yet in many js libraries that use semver. You can remove that in the future hopefully.

## MongoDB setup

Be sure to change the DB user password and session secret in the .env file. Install mongo DB and create the DB user and DB name you intend to use for this app.

Install mongodb (mac-os uses brew install command).
Open terminal and type "mongosh" (mongoshell).

```
use mydb
db.createUser({user: "nodejs", pwd: "ComeUpWithYourOwnPassword", roles: [ "dbOwner" ] })
```

These commands will create a database named mydb, assign a user named nodejs with password ComeUpWithYourOwnPassword and grant him full access rights on that db.

Make sure you are admin beforehand, so that you're able to create dbs and users.

[Note] In order to get the newly created database to show in the list returned by command show dbs, you need to insert at least one document into a collection of the newly created database. For example:
`db.mycollection.insert({firstName: "Adam"});


## Setup Nodejs and packages

If you are setting up your nodejs development anew, install VS code, install nvm (node version manager) then:

```
cd express-mongodb-ejs-MVC-template (move into the template directory)
nvm install --lts (use node version manager to install the latest LTS version of node to your pc)
nvm use --lts (tell node version manager to use the LTS version for this project folder)
npm install (install the required node packages from the package.json file)
npm run dev (runs nodemon and starts the server, when you modify the code base it will restart the server each time)
visit http://localhost:3000 in your browser.
```

### We can do this!

yes we can!

## FAQ

Where is the Controller folder? I don't like abstracting the 'controller' part of 'MVC' and prefer my app logic to exist within the routes.

Over time things change, you'll probably need to update the versions of all the dependancies to the latest version in the future, and make changes to the code base of this template to work with those new versions.

Why EJS? it's just personal preference. In my mind I like having classic full HTML and not the trimmed down PUG/JADE/etc, which I think is better for beginners to learn and understand before moving to those view engines instead if desired. EJS is also the easiest to read and understand when jumping between HTML code and server side javascript code. And it's not hard for you to change the view engine to a different engine if you don't want EJS.
