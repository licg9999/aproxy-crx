# aproxy-crx

## help for development

 0. Make sure that the working directory is the root of project:
 
    ````bash
        cd /path/to/project
    ````
 
 0. Install node development dependencies
 
    ````bash
        npm install
    ````

 0. Install bower dependencies:
 
    ````bash
        cd src && bower install && cd -
    ````
 
 0. Build libs from bower_components:
 
    ````bash
        ./src/build.sh
    ````

 0. Build the whole project:
 
    ````bash 
        grunt
    ````

 0. More about grunt operations see `Gruntfile.js`
