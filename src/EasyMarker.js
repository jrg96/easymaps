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
    }
}
