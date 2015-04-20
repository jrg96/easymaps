@echo off

call uglifyjs src/EasyContextMenu.js src/EasyGeoCoder.js src/EasyGeoCoderData.js src/EasyGeoJSON.js src/EasyLine.js src/EasyLineProperties.js src/EasyMap.js src/EasyMapExternalResource.js src/EasyMapStyleManager.js src/EasyMarker.js src/EasyMarkerCluster.js src/EasyShape.js -b --comments 'all' -o build/easymaps.dev.js

call uglifyjs src/EasyContextMenu.js src/EasyGeoCoder.js src/EasyGeoCoderData.js src/EasyGeoJSON.js src/EasyLine.js src/EasyLineProperties.js src/EasyMap.js src/EasyMapExternalResource.js src/EasyMapStyleManager.js src/EasyMarker.js src/EasyMarkerCluster.js src/EasyShape.js --mangle -o build/easymaps.min.js