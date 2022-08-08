// JavaScript Document
/*eslint-disable no-console*/
/*global app*/

// -----------------------------------------
// Read values (Updates) controls according to object properties

$(function(){
	
	app.control.url = function($input, prop){
		var value;
		
		if(prop === 'src'){
			value = $('img', app.$obj).attr(prop);
		}else{
			value = $('a', app.$obj).attr(prop);
		}
		
		$input.val(value);
	};
	
	app.control.radio = function($input, prop){
		var value;
		if(prop === 'target'){
			value = $('a', app.$obj).attr(prop);
			
		}else if(prop === 'colorType'){
			value = app.util.colorPicker.type;
			
		}else{
			value = app.$obj.css(prop);
		}
		
		// clear radio
        $input.prop('checked', false).checkboxradio('refresh');
        // set radio
        $('[name=' + prop + '][value=' + value + ']')
            .prop('checked', true)
            .checkboxradio('refresh');
	};
	
	app.control.checkbox = function($input, prop){
		var value = app.$obj.css(prop).split(' ');
		
		// clear checkbox
        $input.prop('checked', false).checkboxradio('refresh');
        
		// set checkbox
		$.each(value, function(id, val){
			val = val == 700 ? 'bold' : val;
			$('[name=' + prop + '][value=' + val + ']')
            .prop('checked', true)
            .checkboxradio('refresh');
		});
	}
	
	app.control.spinner = function($input, prop){
		var value = app.$obj.css(prop);
		$input.val(parseInt(value));
	}
	
	app.control.color = function($input, prop){
		prop = app.util.colorPicker.type;
		var value = app.$obj.css(prop);
		var hex = app.util.colorPicker.hex(value);
		
		if(!hex){ return; }
		
		$input.val( hex );
		app.util.colorPicker.update($input);
	}
	
	app.control.text = function($input, prop){
		var value;
		
		if(prop === 'alt'){
			value = $('img', app.$obj).attr(prop);
		}
		
		$input.val(value);
		//var value = app.$obj.css(prop);
		//console.log(value, prop);
	}
	
});