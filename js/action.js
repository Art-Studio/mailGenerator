// JavaScript Document
/*eslint-disable no-console*/
/*global app*/

// -----------------------------------------
// Additional features for the inline editor

$(function(){
	
	var $controlsBox = app.el.$controlsBox;
	var colorPropIndex = $('> div', $controlsBox).index( $('#colorPicker') );
	var fontPropIndex = $('> div', $controlsBox).index( $('#font') );
	
	app.editor.action = {
		/*
		bold: function(){
			wrap('<b>');
		},
		italic: function(){
			wrap('<i>');
		},
		underline: function(){
			wrap('<u>');
		},
		strike: function(){
			wrap('<s>');
		},
		*/
		fontStyle: function(){
			var $obj = wrap('<span>');
			$controlsBox.accordion('option', 'active', fontPropIndex);
			app.$obj = $obj;
			app.getProp();
		},
		fontColor: function(){
			var $obj = wrap('<span>');
			$controlsBox.accordion('option', 'active', colorPropIndex);
			app.$obj = $obj;
			app.getProp();
		}/*,
		fontSize: function(){
			//
		},
		specialCharacter: function(){
			//
		}
		*/
	};
	
	function wrap(tag){
		var $obj = $('span.selected', app.$obj);
		var $parent = $obj.parent();
		var parentTag = $parent.length ? '<' + $parent[0].tagName.toLowerCase() + '>' : false;
		var html = $obj.html();
		
		if(!parentTag){
			return app.$obj;
		}
		
		if(tag === parentTag){
			$obj.replaceWith( html ); // remove selected class
			return $parent;
		}
		
		var newTag = $(tag, {
			html: html
		});
		
		$obj.replaceWith( newTag );
		return newTag;
	}
	
});