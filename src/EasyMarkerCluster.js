/* @license
 *
 * Copyright (c) 2014 Jorge Alberto Gómez López <gomezlopez.jorge96@gmail.com>
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
 
function EasyMarkerCluster(config, map){
    this.latitude = config.latitude;
    this.longitude = config.longitude;
    this.easy_markers = [];
    this.easy_lines = [];
    this.map = map;
    this.icon = ((config.icon != null) ? map.marker_res[config.icon] : '');
    this.initMarker();
    this.bounds = {lat: 0.0001, lng: 0.0001};
    this.k = 0.0001;
    this.markers_hide = true;
    
    var sw = new google.maps.LatLng(this.latitude - this.k, this.longitude - this.k);
    var ne = new google.maps.LatLng(this.latitude + this.k, this.longitude + this.k);
    this.bounds = new google.maps.LatLngBounds(sw, ne);
}
 
EasyMarkerCluster.prototype = {
    constructor: EasyMarkerCluster,
    initMarker: function(){
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.latitude, this.longitude),
            map: this.map.map_obj,
            icon: this.icon
        });
        
        
        var parent = this;
        google.maps.event.addListener(this.marker, 'click', function(){
            if (parent.markers_hide){
                parent.showLines();
                parent.showMarkers();
            } else{
                parent.hideLines();
                parent.hideMarkers();
            }
            parent.markers_hide = !parent.markers_hide;
        });
        
        this.map.master_markers.push(this);
    },
    addChildMarker: function(marker){
        this.easy_markers.push(marker);
        this.removeLines();
        
        var degrees = 360 / this.easy_markers.length;
        var current_degrees = degrees;
        
        for (var i=0; i<this.easy_markers.length; i++){
            var rads = current_degrees * (Math.PI / 180);
            var y = 0.004*Math.sin(rads);
            var x = 0.004*Math.cos(rads);
            
            this.easy_markers[i].latitude = this.latitude + y;
            this.easy_markers[i].longitude = this.longitude + x;
            this.easy_markers[i].updateChildPos();
            this.easy_markers[i].hide();
            
            var line = new EasyLine({
                stroke: '#000000',
                opacity: 1.0,
                weight: 2
            }, this.map);
            
            line.addPoint(this.latitude, this.longitude);
            line.addPoint(this.latitude + y, this.longitude + x);
            this.easy_lines.push(line);
            line.hide();
            
            current_degrees += degrees;
        }
    },
    showLines: function(){
        for (var i=0; i<this.easy_lines.length; i++){
            this.easy_lines[i].show();
        }
    },
    removeLines: function(){
        for (var i=0; i<this.easy_lines.length; i++){
            this.easy_lines[i].remove();
        }
        this.easy_lines = [];
    },
    hideLines: function(){
        for (var i=0; i<this.easy_lines.length; i++){
            this.easy_lines[i].hide();
        }
    },
    contains: function(marker){
        if (this.bounds.contains(marker.marker.getPosition())){
            return true;
        }
        return false;
    },
    showMarkers: function(){
        for (var i=0; i<this.easy_markers.length;i++){
            this.easy_markers[i].show();
        }
    },
    hideMarkers: function(){
        for (var i=0; i<this.easy_markers.length;i++){
            this.easy_markers[i].hide();
        }
    },
    hide: function(){
        this.marker.setMap(null);
    },
    destroy: function(){
        this.hide();
    }
}
