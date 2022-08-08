// JavaScript Document
/*eslint-disable no-console*/
/*global app*/

// --------------------------------------------------------
// Functions for setting general properties of email blocks

$(function(){
	
	var $previewBox = app.el.$previewBox;
	var $toolsBox = app.el.$toolsBox;
	//var $propBox = app.el.$propBox;
	var $source = $('textarea', app.el.$sourceBox);
	var $output = $('textarea', app.el.$outputBox);
	var $controls = app.el.$controls;
	
	// get version
	ver();
	function ver(){
		var date = new Date( document.lastModified );
		var y = date.getFullYear().toString().slice(-2);
		var m = ('0' + (date.getMonth() + 1)).slice(-2);
		var d = ('0' + date.getDay()).slice(-2);
		var ver = 'Beta 0.' + y + m + d;
		
		$('#ver var').text(ver);
	}
	
	app.setObj = function($this){
		
		app.$tr = $this;
		
		app.$obj = $this;
		if($this[0].tagName.toLowerCase() === 'tr'){
			app.$obj = $('td', $this);
		}
		
		$('.active', $previewBox).removeClass('active');
		app.$tr.addClass('active');
		app.getProp();
	};
	
	app.import = function(file){
		//console.log('Import', file);
		
		var fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = function(data){

            var result = data.target.result;
			result = $('tbody tr', result);
            console.log('Import:', result);
			$('tbody', $previewBox).html(result);
			app.sortable();
        };		
	};
	
	app.getSource = function(){
		if(app.$obj.attr('id') === 'helper'){
			$source.val('');
		}else{
			//$source.val( app.util.prettify(app.$obj[0].outerHTML) );
			$source.val( app.util.prettify( app.$obj.html() ) );
		}
	};
	
	app.updateSource = function(){
		app.$obj.html( $source.val() );
		app.getSource();
	};
	
	app.getOutput = function(){
		$.get('tpl/output.tpl', function(data) {
			var innerHtml = $('table', $previewBox)
			.find('*')
			.removeAttr('class')
			.html();
			
			innerHtml = app.util.prettify( innerHtml, 3 );
			data = data.replace('{{tbody}}', innerHtml);
			data = data.replaceAll('{{snippet}}', $('input[name=snippet]').val());
			$output.val(data);
		});
	};
	
	app.saveOutput = function(){
		var d = new Date();
		var data = $output.val();
		var file = new Blob([data], {type: 'text/plain'});
		var fileName = 
			d.getDate() + '-' + 
			(d.getMonth() + 1) + '-' + 
			d.getFullYear() + '_emailTpl.html'
		
		var a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
		a.remove();
	};
	
	app.getProp = function(){
		
		$controls.each(function(){
			
			var $input = $(this);
			var type = $input.attr('type');
			var prop = $input.attr('name');
			
			app.control[type]($input, prop);
			
		});
		
        $toolsBox.tabs('option', 'active', 1);
    };
	
	app.setProp = function($input){
		
		var prop = $input.attr('name');
		var type = $input.attr('type');
		var value = $input.val();
		
		if(type === 'radio'){
			if(prop === 'target'){
				$('a', app.$obj).attr(prop, value);
			}else{
				app.$obj.css(prop, value);
			}
			
		}else if(type === 'checkbox'){
			value = '';
			var $items = $('input[type=checkbox][name=' + prop + ']:checked');
			$items.each(function(){
				value += ' ' + $(this).val();
			});
			//value = $input.is(':checked') ? value : '';
			app.$obj.css(prop, value);
			
		}else if(type === 'spinner'){
			app.$obj.css(prop, value + 'px');
			
		}else if(type === 'color'){
			app.$obj.css(app.util.colorPicker.type, value);
			
		}else if(type === 'url'){
			if(prop === 'src'){
				$('img', app.$obj).attr(prop, value);
			}else{
				$('a', app.$obj).attr(prop, value);
			}
			
		}else if(type === 'text'){
			if(prop === 'fontFamily'){
				app.$obj.css(prop, '"' + value.split(':')[0] + '"');
				
			}else if(prop === 'alt'){
				$('img', app.$obj).attr(prop, value);
			}
		}
		
	};
});