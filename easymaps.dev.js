// --- file[EasyLine.js] ---

/* Copyright (c) 2014 Jorge Alberto G�mez L�pez <gomezlopez.jorge96@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.*/
 
 function EasyLine(config, map){
    this.strokeColor = config.stroke;
    this.strokeOpacity = config.opacity;
    this.strokeWeight = config.weight;
    
    this.map = map.map_obj;
    this.route = new google.maps.MVCArray();
    this.polyline = new google.maps.Polyline({
        path: this.route,
        strokeColor: this.strokeColor,
        strokeWeight: this.strokeWeight,
        strokeOpacity: this.strokeOpacity
    });
    this.setMap(this.map);
}

EasyLine.prototype = {
    constructor: EasyLine,
    setMap: function(map){
        this.map = map;
        this.polyline.setMap(this.map);
    },
    addPoint: function(latitude, longitude){
        this.route.push(new google.maps.LatLng(latitude, longitude));
    }
}

// --- file[EasyLineProperties.js] ---

/* Copyright (c) 2014 Jorge Alberto G�mez L�pez <gomezlopez.jorge96@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.*/
 
 function EasyLineProperties(config){
    this.strokeColor = ((config.stroke != null) ? config.stroke : '#FF0000');
    this.strokeOpacity = ((config.opacity != null) ? config.opacity : 1.0);
    this.strokeWeight = ((config.weight != null) ? config.weight : 5);
}

EasyLineProperties.prototype = {
    constructor: EasyLineProperties,
    setDefaultStroke: function(stroke){
        this.strokeColor = stroke;
    },
    getDefaultStroke: function(){
        return this.strokeColor;
    },
    setDefaultOpacity: function(opacity){
        this.strokeOpacity = opacity;
    },
    getDefaultOpacity: function(){
        return this.strokeOpacity;
    },
    setDefaultWeight: function(weight){
        this.strokeWeight = weight;
    },
    getDefaultWeight: function(){
        return this.strokeWeight;
    },
    makeConfig: function(){
        return {
            stroke: this.strokeColor,
            opacity: this.strokeOpacity,
            weight: this.strokeWeight
        };
    }
}

// --- file[EasyMap.js] ---

/* Copyright (c) 2014 Jorge Alberto Gómez López <gomezlopez.jorge96@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.*/

function EasyMap(config){
    this.map_el = document.getElementById(config.container);
    this.map_obj = null;
    this.info_window_system = ((config.infoWindowSystem != null) ? config.infoWindowSystem : EasyMap.InfoWindowSystem.ONE_WINDOW);
    this.map_markers = [];
    this.map_lines = [];
    this.map_shapes = [];
    this.marker_res = {};
    
    this.default_line_props = new EasyLineProperties({});
    
    this.current_maptypeid = ((config.mapTypeId != null) ? config.mapTypeId : google.maps.MapTypeId.ROADMAP);
    
    this.infoWindow = null;
    
    this.marker_callback = null;
    
    this.map_options = {
        center: new google.maps.LatLng(config.latitude, config.longitude),
        zoom: ((config.zoom != null) ? config.zoom : 15),
        mapTypeId: this.current_maptypeid
        /*mapTypeControlOptions: {mapTypeIds:
            [((config.mapTypeId != null) ? config.mapTypeId : google.maps.MapTypeId.ROADMAP)]
        }*/
    };
    
    this.map_obj = new google.maps.Map(this.map_el, this.map_options);
    this.map_clusterer = new MarkerClusterer(this.map_obj);
    this.map_style_manager = new EasyMapStyleManager({map: this.map_obj});
    
    this.initInfoWindowSystem();
}

EasyMap.prototype = {
    constructor: EasyMap,
    initInfoWindowSystem: function(){
        if (this.info_window_system == EasyMap.InfoWindowSystem.ONE_WINDOW){
            this.infoWindow = new google.maps.InfoWindow({
                content:'placeholder'
            });
        }
    },
    getCenter: function(){
        return this.map_obj.getCenter();
    },
    setCenter: function(lat, lng){
        this.map_obj.setCenter(new google.maps.LatLng(lat, lng));
    },
    getZoom: function(){
        return this.map_obj.getZoom();
    },
    setZoom: function(zoom){
        this.map_obj.setZoom(zoom);
    },
    changeToRoadmap: function(){
        this.map_obj.setMapTypeId(google.maps.MapTypeId.google.maps.MapTypeId.ROADMAP);
        this.current_maptypeid = google.maps.MapTypeId.google.maps.MapTypeId.ROADMAP;
    },
    changeToSatellite: function(){
        this.map_obj.setMapTypeId(google.maps.MapTypeId.SATELLITE);
        this.current_maptypeid = google.maps.MapTypeId.SATELLITE;
    },
    addMarker: function(config){
        var parent = this;
        
        var marker = new EasyMarker(config, this);
        
        google.maps.event.addListener(marker.marker, 'click', function() {
            parent.marker_callback(marker);
        });
        
        this.map_markers.push(marker);
        marker.setMetadata(config.metadata);
        
        
        var infoWindow = this.infoWindow;
        
        if (this.info_window_system == EasyMap.InfoWindowSystem.MULTIPLE_WINDOW){
            infoWindow = new google.maps.InfoWindow({
                content:'placeholder'
		    });
        }
        
        marker.setInfoWindow(infoWindow);
        
        return marker;
    },
    clearAllMarkers: function(){
        for (var i=0; i<this.map_markers.length; i++){
            this.map_markers[i].destroy();
        }
        this.map_markers = [];
    },
    addMarkerRes: function(key, value){
        this.marker_res[key] = value;
    },
    setMarkerRes: function(dictionary){
        this.marker_res = dictionary;
    },
    setMarkersCallbackFunc: function(func){
        this.marker_callback = func;
    },
    getMarkersCallbackFunc: function(){
        return this.marker_callback;
    },
    cluster: function(){
        var markers = [];
        for (var i=0; i<this.map_markers.length; i++){
            markers.push(this.map_markers[i].marker);
        }
        this.map_clusterer.addMarkers(markers);
    },
    decluster: function(){
        var markers = this.map_clusterer.getMarkers();
        this.map_clusterer.clearMarkers();
        
        for (var i=0; i<markers.length; i++){
            markers[i].setMap(this.map_obj);
        }
    },
    newLine: function(){
        this.map_lines.push(new EasyLine(this.default_line_props.makeConfig(), this));
    },
    getCurrentLine: function(){
        return this.map_lines[this.map_lines.length - 1];
    },
    newPolygon: function(pts){
        this.map_shapes.push(new EasyShape({
            points: pts
        }, this));
    }
}

EasyMap.InfoWindowSystem = {NONE_WINDOW : 0,
                            ONE_WINDOW: 1,
                            MULTIPLE_WINDOW : 2};
                            



// --- file[EasyMarker.js] ---

/* Copyright (c) 2014 Jorge Alberto Gómez López <gomezlopez.jorge96@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.*/
 
function EasyMarker(config, map){
    this.latitude = config.latitude;
    this.longitude = config.longitude;
    this.title = ((config.title != null) ? config.title : '');
    this.map = map.map_obj;
    this.icon = ((config.icon != null) ? map.marker_res[config.icon] : '');
    this.marker = null;
    this.metadata = null;
    this.content = null;
    this.infoWindow = null;
    this.initMarker();
}
 
EasyMarker.prototype = {
    constructor: EasyMarker,
    initMarker: function(){
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.latitude, this.longitude),
            map: this.map,
            title: this.title,
            icon: this.icon
        });
    },
    setMetadata: function(metadata){
        this.metadata = metadata;
    },
    getMetadata: function(){
        return this.metadata;
    },
    setInfoContent: function(content){
        this.content = content;
    },
    getInfoContent: function(){
        return this.content;
    },
    setInfoWindow: function(window){
        this.infoWindow = window;
    },
    showInfoWindow: function(value){
        if (value != null){
            this.content = value;
        }
        this.infoWindow.setContent(this.getInfoContent());
        this.infoWindow.open(this.map, this.marker);
    },
    hide: function(){
        this.marker.setMap(null);
    },
    destroy: function(){
        this.hide();
    }
}


// --- file[EasyMapStyleManager.js] ---

/* Copyright (c) 2014 Jorge Alberto G�mez L�pez <gomezlopez.jorge96@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.*/
 
function EasyMapStyleManager(config){
    this.styledMaps = {};
    this.map = config.map;
}
 
EasyMapStyleManager.prototype = {
    constructor: EasyMapStyleManager,
    addStyleMap: function(config){
        var styledMap = new google.maps.StyledMapType(config.style);
        this.styledMaps[config.name] = styledMap;
        
        var arrMapTypeIds = this.makeMapTypeIds();
        this.map.setOptions({mapTypeControlOptions: {mapTypeIds: arrMapTypeIds}});
        
        for (var i=1; i<arrMapTypeIds.length; i++){
            var key = arrMapTypeIds[i];
            var value = this.styledMaps[key];
            
            this.map.mapTypes.set(key, value);
        }
    },
    makeMapTypeIds: function(){
        var array = [];
        
        array.push(this.map.current_maptypeid);

        for (var key in this.styledMaps) {
            if (this.styledMaps.hasOwnProperty(key)) {
                array.push(key);
            }
        }
        
        return array;
    }
}

// --- file[EasyShape.js] ---

/* Copyright (c) 2014 Jorge Alberto G�mez L�pez <gomezlopez.jorge96@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.*/
 
 function EasyShape(config, map){
    this.map = map.map_obj;
    this.points = config.points;
    this.polygon = new google.maps.Polygon({
        paths: this.points
    });
    this.setMap(this.map);
}

EasyShape.prototype = {
    constructor: EasyShape,
    setMap: function(map){
        this.map = map;
        this.polygon.setMap(this.map);
    }
}