// JavaScript Document
/*eslint-disable no-console*/
/*global app*/

$(function(){
	
	var $propBox = app.el.$propBox;
	
//---------------------------------------------------------------------- PRETTIFY
	app.util.prettify = function(html, indent){
		
		indent = indent ? indent : 0;
		
		function parse(html, tab) {
			
			html = $.parseHTML(html);
			var formatHtml = new String();

			function setTabs () {
				var tabs = new String();

				for (var i = 0; i < tab; i++){
					tabs += '\t';
				}
				return tabs;
			}

			$.each( html, function( i, el ) {
				var outerHTML;
				if (el.nodeName == '#text' || el.nodeName == '#comment') {
					if (($(el).text().trim()).length) {
						formatHtml += setTabs() + $(el).text().trim() + '\n';
					}
					
					if(el.nodeName == '#comment'){
						formatHtml += setTabs() + '<!-- ' + $(el)[0].textContent.trim() + ' -->\n';
					}
				} else {
					var innerHTML = $(el).html().trim();
					$(el).html(innerHTML.replace('\n', '').replace(/ +(?= )/g, ''));

					if ($(el).children().length) {
						$(el).html('\n' + parse(innerHTML, (tab + 1)) + setTabs());
						outerHTML = $(el).prop('outerHTML').trim();
						formatHtml += setTabs() + outerHTML + '\n';

					} else {
						outerHTML = $(el).prop('outerHTML').trim();
						formatHtml += setTabs() + outerHTML + '\n';
					}
				}
			});
			return formatHtml;
		}
		return parse(html.replace(/(\r\n|\n|\r)/gm," ").replace(/ +(?= )/g,''), 0 + indent);
	};
	
//---------------------------------------------------------------------- COLOR PICKER
	var $sliderBox = $('#colorPicker .slider');
	var $sliders = $('#r, #g, #b', $sliderBox);
	
	var $colorPreview = $('#colorPicker .preview label');
	var $colorInput = $('#colorPicker .preview input');
	var $colorType = $('#colorType input');
	
	$sliderBox.hover(function(){
		$(this).addClass('hover');
	}, function() {
		$(this).removeClass('hover');
	});
	
    $sliders.slider({
        orientation: 'horizontal',
        range: 'min',
		min: -10,
        max: 265,
        value: 127,
        slide: function(event, ui){
			var isSliderHover = $sliderBox.hasClass('hover');
			if(!isSliderHover){ return false; }
			
			// min max slide value
            if(ui.value > 260){ $(this).slider('value', 255); return false; }
            if(ui.value < -5){ $(this).slider('value', 0); return false; }
			
			app.util.colorPicker.update($(this)); 
		}
    });
	
	$colorInput.on('input', function(){
		app.util.colorPicker.update($(this));
	});
	
	$colorType.on('input', function(){
		app.util.colorPicker.type = $(this).val();
		app.getProp();
		//console.log(app.util.colorPicker.type);
	});

	app.util.colorPicker = {
		
		type: $colorType.filter(':checked').val(),
		
		rgb: { r: 127, g: 127, b: 127 },
		
		hex: function(rgb){
			if(rgb){
				//console.log(rgb);
				rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
				app.util.colorPicker.rgb = {
					r: Number(rgb[1]),
					g: Number(rgb[2]),
					b: Number(rgb[3]),
					//a: Number(rgb[4])
				}
				if(rgb[4] === '0'){ return false; } // ignore opacity
			}
			rgb = app.util.colorPicker.rgb;
			var hex = [ rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16) ];
			$.each(hex, function(nr, val){ if( val.length === 1 ){ hex[ nr ] = '0' + val; } });
			return '#' + (hex.join('').toUpperCase());
		},
		
		update: function($obj){
			var val;
			var id = $obj.attr('id');
			
			if(id === 'hex'){
				val = parseInt( $obj.val().replace('#',''), 16 );
				$.each(app.util.colorPicker.rgb, function(key){
					var newVal;
					if(key === 'r'){ newVal = (val >> 16) & 255; }
					if(key === 'g'){ newVal = (val >> 8) & 255; }
					if(key === 'b'){ newVal = val & 255; }
					app.util.colorPicker.rgb[key] = newVal;
					$('#' + key).slider('value', newVal).find('i').text(newVal);
				});
				
			}else{
				val = $obj.slider('value');
				// min max value
				if(val > 255){ val = 255; }
				if(val < 0){ val = 0; }
				$('i', $obj).text(val);
				app.util.colorPicker.rgb[id] = val;
			}
			val = app.util.colorPicker.hex();
			$colorInput.val(val).change();
			$colorPreview.css('background-color', val);
		}
	};
	
//---------------------------------------------------------------------- FONT PICKER

    /*
    var fontLinks = {
        'serif': null,
        'sans-serif': null,
        'display': null,
        'handwriting': null,
        'monospace': null
    };
    */

	// connect font picker
    $('input[name=fontFamily]', $propBox).fontpicker( app.fontpickerCfg );

	// change category
    var $fontCat = $('.fp-filter span.fp-category');
    $fontCat
        .removeClass('checked active')
        .on('click', function(){
        /*
            var prevCat = $('.fp-filter span.fp-category.active').text();
            var nowCat = $(this).text();
            var $items = $('head title').nextAll();

            if( $items.length ){
                $items.remove();
                $('head').append(fontLinks[nowCat]);
                fontLinks[prevCat] = $items;
                console.log(fontLinks);
            }
        */
            $fontCat.removeClass('checked active');
            $(this).addClass('active');
        })
        .eq(1).click();

    $('.fp-filter select.fp-lang').on('change', function(){
		// update category
        $fontCat.filter('.active').click();
    });
	
});