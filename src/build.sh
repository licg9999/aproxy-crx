cd ./src
rm -R ./libs
mkdir ./libs

cp ./bower_components/seajs/dist/sea.js ./libs/
cp ./bower_components/seajs-css/dist/seajs-css.js ./libs/

cp ./bower_components/pure/pure-min.css ./libs/
cp -R ./bower_components/fontawesome/css ./libs/
rm ./libs/css/font-awesome.css
rm ./libs/css/font-awesome.css.map
cp -R ./bower_components/fontawesome/fonts ./libs/

cp ./bower_components/underscore/underscore-min.js ./libs/
cp ./bower_components/jquery/dist/jquery.min.js ./libs/
cp ./bower_components/uri.js/src/URI.min.js ./libs/
