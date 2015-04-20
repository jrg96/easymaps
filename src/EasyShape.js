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