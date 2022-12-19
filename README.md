# sqliteAdmin
Web application to view/modify sqlite databases on a server or locally.

### Features:
* Select
* Edit
* Delete
* Update
* Import
* Export (with **advanced** features such as selecting wich columns to export, changing the names of the columns and adding a where statement)
* Download
* Vacuum
* Execute raw SQL
* Clone
* Generate statements
* Exectute same SQL for different databases at once

### What makes this better and more usefull then phpliteadmin:
* Databases are searchable
* Settings are editable in the web application except for the password. (directory, subdirectories, extensions, ...)
* It is more user friendly

### Installation guide:
#### Requirements:
* node.js
* npm
* https://github.com/nodejs/node-gyp#installation
### Installation:
1. git clone https://github.com/LaurentDhont/sqliteAdmin.git
2. cd sqliteAdmin
3. npm install
4. npm run build
5. npm start

**Default password: passwordForSqliteAdmin**: this can be changed in the sqliteAdmin/config/config.conf file
