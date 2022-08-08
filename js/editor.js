// JavaScript Document
/*eslint-disable no-console*/
/*global app*/

// -------------------------------------------
// Inline editor functions for the email block

$(function(){
	
	var $previewBox = app.el.$previewBox;
	var $toolsBox = app.el.$toolsBox;
	var $activeObj;
	
	var action = {
		/*
		bold: { icon: 'format_bold' },
		italic: { icon: 'format_italic' },
		underline: { icon: 'format_underlined' },
		strike: { icon: 'format_strikethrough' },
		*/
		fontStyle: { icon: 'glyphs' },
		fontColor: { icon: 'format_color_fill' },
		/*fontSize: { icon: 'format_size' },
		specialCharacter: { icon: 'euro' }*/
	};
	
	//var menu = 'bold,italic,underline,strike,|,fontFamily,fontColor,fontSize,specialCharacter';
	var menu = 'fontStyle,fontColor,|';
	
	$(document).click(function(e){
		// editor lost focus
		var $target = $(e.target);
		
		if(
			!$target.closest($previewBox).length
			&& !$target.closest($('div[role=tooltip]')).length
			&& !$target.closest($toolsBox).length
			&& !$target.closest($('body > .font-picker')).length
		){
			
			$toolsBox.tabs('option', 'active', 0);
			
			app.editor.disable();
			$('.active', $previewBox).removeClass('active');
			app.$obj = app.el.$helper;
			
		}else{
			// select active obj in the editor mode
			if(app.$obj[0].tagName.toLowerCase() !== 'td'){
				var $activeObj = $(app.$obj, '.editor');
				$('.active', '.editor').removeClass('active');
				$activeObj.addClass('active');
			}
		}
	});
	
	app.editor = {
		enable: function($obj){
			var $td = $('td', $obj);
			
			if($activeObj){
				if($obj.hasClass('editor')){ return; }
				app.editor.disable();
			}

			$obj.addClass('editor');
			$('tbody', $previewBox).sortable('disable');
			
			$td.tooltip({
				items: '*',
				position: { my: 'right top', at: 'right bottom' },
				content: function() {
					var html = '';
					var order = menu.split(',');
					$.each(order, function(key, val){
						if(val === '|'){
							html += '<b class="divider">|</b>';
						}else{
							html += '<i class="icon" role="' + val + '" title="' + val + '">' + action[val].icon + '</i>';
						}
					});
					
					return html;
				},
				create: function(){
					$td.tooltip('open').off();
				
					$('i', 'div[role=tooltip]').on('click', function(){
						app.editor.action[$(this).attr('role')]();
					});
				}
			})
			.attr('contenteditable', true).focus()
			.focusout(function(){ // select text
				var range = document.getSelection().getRangeAt(0);
				var selectionContents = range.extractContents();
				var span = document.createElement('span');
				span.appendChild(selectionContents);
				span.setAttribute('class', 'selected');
				range.insertNode(span);
			});

			$activeObj = $obj;
		},
		
		disable: function (){
			if(!$activeObj){ return; }
			
			var $td = $('td', $activeObj);
			
			// remove selected class
			$('span.selected', $td).replaceWith( $('span.selected', $td).html() );
			
			try{
				$td.removeAttr('contenteditable').tooltip('destroy').off();
			}catch(e){/* tooltip warnings */}
			
			$activeObj.removeClass('editor');
			$('tbody', $previewBox).sortable('enable');
		}
	}
});