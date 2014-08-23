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
    this.marker_res = {};
    this.marker_metadata = {};
    this.info_windows = [];
    this.info_contents = [];
    this.marker_callback = null;
    
    this.map_options = {
        center: new google.maps.LatLng(config.latitude, config.longitude),
        zoom: ((config.zoom != null) ? config.zoom : 15),
        mapTypeId: ((config.mapTypeId != null) ? config.mapTypeId : google.maps.MapTypeId.ROADMAP)
    };
    
    this.map_obj = new google.maps.Map(this.map_el, this.map_options);
    
    this.initInfoWindowSystem();
}

EasyMap.prototype = {
    constructor: EasyMap,
    initInfoWindowSystem: function(){
        if (this.info_window_system == EasyMap.InfoWindowSystem.ONE_WINDOW){
            this.addInfoWindow();
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
    },
    changeToSatellite: function(){
        this.map_obj.setMapTypeId(google.maps.MapTypeId.SATELLITE);
    },
    addMarker: function(config){
        var parent = this;
        
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(config.latitude, config.longitude),
            map: this.map_obj,
            title: ((config.title != null) ? config.title : ''),
            icon: ((config.icon != null) ? this.marker_res[config.icon] : '')
        });
        
        google.maps.event.addListener(marker, 'click', function() {
            parent.marker_callback(marker);
        });
        
        this.map_markers.push(marker);
        if (config.metadata != null){
            this.marker_metadata[marker] = config.metadata;
        }
        
        if (this.info_window_system == EasyMap.InfoWindowSystem.MULTIPLE_WINDOW){
            this.addInfoWindow();
        }
        
        return marker;
    },
    addMarkerRes: function(key, value){
        this.marker_res[key] = value;
    },
    setMarkerRes: function(dictionary){
        this.marker_res = dictionary;
    },
    addInfoWindow: function(){
        var infowindow = new google.maps.InfoWindow({
            content:'placeholder'
        });
        this.info_windows.push(infowindow);
    },
    setMarkersCallbackFunc: function(func){
        this.marker_callback = func;
    },
    getMarkersCallbackFunc: function(){
        return this.marker_callback;
    },
    getMarkerIndex: function(marker){
        return this.map_markers.indexOf(marker);
    },
    getMarkerMetadata: function(marker){
        return this.marker_metadata[marker];
    },
    setMarkerMetadata: function(marker, metadata){
        this.marker_metadata[marker] = metadata;
    },
    setInfoContent: function(marker, value){
        var index = this.getMarkerIndex(marker);
        this.info_contents[index] = value;
    },
    getInfoContent: function(marker){
        return this.info_contents[this.getMarkerIndex(marker)];
    },
    getInfoWindow: function(marker){
        if (this.info_window_system == EasyMap.InfoWindowSystem.MULTIPLE_WINDOW){
            return this.info_windows[this.getMarkerIndex(marker)];
        }
        return this.info_windows[0];
    },
    showInfoWindow: function(marker, value){
        if (value != null){
            this.setInfoContent(marker, value);
        }
        var info_window = this.getInfoWindow(marker);
        info_window.setContent(this.getInfoContent(marker));
        info_window.open(this.map_obj, marker);
    }
}

EasyMap.InfoWindowSystem = {NONE_WINDOW : 0,
                            ONE_WINDOW: 1,
                            MULTIPLE_WINDOW : 2};
