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