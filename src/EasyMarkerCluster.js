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
 
function EasyMarkerCluster(config, map){
    this.latitude = config.latitude;
    this.longitude = config.longitude;
    this.marker_data = config.markers;
    this.easy_markers = [];
    this.map = map;
    this.icon = ((config.icon != null) ? map.marker_res[config.icon] : '');
    this.initMarker();
}
 
EasyMarkerCluster.prototype = {
    constructor: EasyMarkerCluster,
    initMarker: function(){
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.latitude, this.longitude),
            map: this.map.map_obj,
            icon: this.icon
        });
        
        google.maps.event.addListener(this.marker, 'click', function(){
            alert("Marcador maestro clickado");
        });
        
        this.map.map_markers.push(this.marker);
        
        for (var i=0; i<this.marker_data.length; i++){
            var mark = new EasyMarker({
                latitude: this.marker_data[i].lat,
                longitude: this.marker_data[i].lng,
            }, this.map);
            this.easy_markers.push(mark);
            mark.hide();
        }
    },
    hide: function(){
        this.marker.setMap(null);
    },
    destroy: function(){
        this.hide();
    }
}
