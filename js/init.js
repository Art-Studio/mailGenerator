// JavaScript Document
/*eslint-disable no-console*/
/*global app*/

// ------------------------------------------------------------------------
// Receiving data, connecting plugins, initializing variables and functions

$(function(){
	
	var $toolsBox = app.el.$toolsBox;
	var $itemsBox = app.el.$itemsBox;
	var $propBox = app.el.$propBox;
	
	// load Items
	$.get('tpl/items.tpl', function(data) {
		
		var items = '';
		var $items = $('tr', data);
		
		$items.each(function(){
			var $item = $(this);
			var itemId = $item.attr('id');
			var itemTitle = $item.attr('title');
				itemTitle = itemTitle ? 'title="' + itemTitle + '"' : '';
			var itemClass = 'class="' + itemId + '"';
			var itemHtml = $item.html();
			
			items += '<tr bgcolor="#f5f5f5" ' + itemClass + itemTitle + '>' + itemHtml + '</tr>';
		});
		
		$itemsBox
			.append('<table><tbody>' + items + '</tbody></table>')
			.find('tr:not(:last)')
			.find('td').css({ padding: '8px' })
			.find('img').css({ maxWidth: '100%', border: 0 });
		
		console.log('Get items:', 'Success');
		app.sortable();
		
		// start tooltip
		$(document).tooltip();
		
		$(window).on('blur focus', function(e){
			if(e.type === 'focus'){
				setTimeout(function(){
					$(document).tooltip('enable');
				}, 90);
			}else{
				$(document).tooltip('disable');
			}
		});
		
		app.ready();
	});
	
	// init tabs
	$toolsBox
		.tabs({
			beforeActivate: function(event, ui) {
				if(ui.newTab.index() === 2){ app.getSource(); }
				if(ui.newTab.index() === 3){ app.getOutput(); }
			}
		}).draggable({ cancel: '#toolsBox > * > *' });
	
	// init propBox
	// INPUTS
    $('input[type=spinner]', $propBox).spinner(); // spinner
	$('label a').click(function(){ // event for input arrows
		var $parent = $(this).parent();
		$('input', $parent).change();
	});
	
	// checkbox & radio
	$('input[type=radio], input[type=checkbox]', $propBox).checkboxradio();
	
	// inputs event
	$('input').on('change', function(){
		app.setProp($(this));
	});
	
	// buttons event
	$('button, a', '#previewBox, #source, #output')
		.button()
		.on('click', function(){
			var id = $(this).attr('id');
		
			if(id === 'copy'){
				$('textarea', app.el.$outputBox).select();
				document.execCommand('copy');
			}
			else if(id === 'save'){ app.saveOutput(); }
			
			else if(id === 'import'){ app.el.$import.click(); }
			
			else if(id === 'update'){ app.updateSource(); }
		}
	);
	
	// import file
	app.el.$import.change(function(){
        // uploadFile($(this).prop('files')[0]);
        var file = $(this).prop('files')[0];
        if(file){ app.import(file); }
    });
	
	// accordion style
	$('#controls, #help div.accordion').accordion({
		collapsible: true,
		heightStyle: 'content'
	}).on('click', function(e){
		// iframe lazy load
		var $iframe = $('iframe', $(e.target).next());
		if($iframe && !$iframe.attr('src')){ $iframe.attr('src', $iframe.data('src')) }
	});
	
});