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
    
    this.logo_div;
    this.logo_img;
    this.coordinates_div = document.createElement('div');
    this.coordinates_div.setAttribute('style', 'width: 200px; height: 20px; background-color: #FFFFFF; border-style: solid; border-width: 1px; padding: 2px 5px;');
    this.coordinates_div.innerHTML = 'Lat/Lng: 0.00 / 0.00';
    this.coordinates_shown = false;
    
    this.default_line_props = new EasyLineProperties({});
    
    this.current_maptypeid = ((config.mapTypeId != null) ? config.mapTypeId : google.maps.MapTypeId.ROADMAP);
    
    this.infoWindow = null;
    
    this.marker_callback = null;
    
    this.map_options = {
        center: new google.maps.LatLng(config.latitude, config.longitude),
        zoom: ((config.zoom != null) ? config.zoom : 15),
        mapTypeId: this.current_maptypeid
    };
    
    this.map_obj = new google.maps.Map(this.map_el, this.map_options);
    this.map_clusterer = new MarkerClusterer(this.map_obj);
    
    this.map_style_manager = new EasyMapStyleManager({map: this.map_obj});
    this.map_ext_src = new EasyExternalResource({map: this.map_obj});
    this.map_geojson = new EasyGeoJSON({map: this.map_obj});
    
    this.allowed_map_bounds;
    this.max_zoom_level;
    this.min_zoom_level;
    
    this._attachMapEvents();
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
    },
    getStyleManager: function(){
        return this.map_style_manager;
    },
    getExtResourceManager: function(){
        return this.map_ext_src;
    },
    loadGeoJSON: function(url, callback){
        var parent = this;
        
        $.getJSON(url, function(data) {
            parent.map_geojson.addGeoJSON(data);
            callback();
        });
    },
    setBounds: function(config){
        if (!config.enable){
            this.allowed_map_bounds = null;
            this.max_zoom_level = 20;
        } else{
            this.max_zoom_level = ((config.maxZoom != null) ? config.maxZoom : 20);
            this.min_zoom_level = ((config.minZoom != null) ? config.minZoom : 0);
            
            if (config.bounds != null){
                this.allowed_map_bounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(config.bounds[0][0], config.bounds[0][1]),
                    new google.maps.LatLng(config.bounds[1][0], config.bounds[1][1])
                );
            }
        }
    },
    setLogo: function(path){
        this.removeLogo();
        this.logo_div = document.createElement('div');
        this.logo_img = document.createElement('img');
        this.logo_img.src = path;
        this.logo_img.id = 'CompanyLogo';
        this.logo_div.appendChild(this.logo_img);
        this.map_obj.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(this.logo_div);
    },
    removeLogo: function(){
        if (this.logo_div != null){
            this.map_obj.controls[google.maps.ControlPosition.LEFT_BOTTOM].pop();
        }
    },
    showCoordinates: function(){
        if (!this.coordinates_shown){
            this.coordinates_shown = true;
            this.map_obj.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.coordinates_div);
        }
    },
    hideCoordinates: function(){
        if (this.coordinates_shown){
            this.coordinates_shown = false;
            this.map_obj.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop();
        }
    },
    _attachMapEvents: function(){
        var parent = this;
        google.maps.event.addListener(this.map_obj, 'drag', function(){
            parent._mapDrag();
        });
        
        google.maps.event.addListener(this.map_obj, 'zoom_changed', function(){
            parent._mapZoom();
        });
        
        google.maps.event.addListener(this.map_obj, 'click', function(e) {
            //alert(e.latLng.lat(), e.latLng.lng());
        });
        
        google.maps.event.addListener(this.map_obj, 'mousemove', function(e) {
            parent._mapMouseMove(e);
        });
    },
    _mapDrag: function(){
        this._checkBounds();
    },
    _mapZoom: function(){
        this._checkBounds();
    },
    _mapMouseMove: function(e){
        if (this.coordinates_shown){
            var coordinateText = 'Lat/Lng: ' + e.latLng.lat().toFixed(6) + ' / ' + e.latLng.lng().toFixed(6);
            this.coordinates_div.innerHTML = coordinateText;
        }
    },
    _checkBounds: function(){
        if (this.map_obj.getZoom() > this.max_zoom_level){
            this.map_obj.setZoom(this.max_zoom_level);
        } else if (this.map_obj.getZoom() < this.min_zoom_level){
            this.map_obj.setZoom(this.min_zoom_level);
        }
        
        if(!this.allowed_map_bounds.contains(this.map_obj.getCenter())) {
            var C = this.map_obj.getCenter();
            var X = C.lng();
            var Y = C.lat();

            var AmaxX = this.allowed_map_bounds.getNorthEast().lng();
            var AmaxY = this.allowed_map_bounds.getNorthEast().lat();
            var AminX = this.allowed_map_bounds.getSouthWest().lng();
            var AminY = this.allowed_map_bounds.getSouthWest().lat();

            if (X < AminX) {X = AminX;}
            if (X > AmaxX) {X = AmaxX;}
            if (Y < AminY) {Y = AminY;}
            if (Y > AmaxY) {Y = AmaxY;}

            this.map_obj.setCenter(new google.maps.LatLng(Y,X));
        }
    }
}

EasyMap.InfoWindowSystem = {NONE_WINDOW : 0,
                            ONE_WINDOW: 1,
                            MULTIPLE_WINDOW : 2};
                            

