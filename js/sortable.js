// JavaScript Document
/*eslint-disable no-console*/
/*global app*/

// ------------------------------------------------
// Inserting and sorting email blocks (drag & drop)

$(function(){
	
	var $previewBox = app.el.$previewBox;
	var $itemsBox = app.el.$itemsBox;
	
	app.sortable = function(){
		
		var canRemove;
		var isReceive;
		
		$('tbody', $itemsBox).sortable({
			items: 'tr:not(:last)',
			connectWith: '#previewBox tbody',
			placeholder: 'ui-state-highlight',
			forcePlaceholderSize: true,
			cursor: 'grabbing',
			opacity: 0.8,
			helper: function(event, ui){
				isReceive = false;
				$(document).tooltip('destroy'); // disable tooltip
				this.copyHelper = ui.clone().insertAfter(ui);
				return ui.clone();
			},
			stop: function(){
				if (!isReceive){
					this.copyHelper.remove();
					$(this).sortable('cancel');
				}
				this.copyHelper = null;
				$(document).tooltip(); // activate tooltip
			}
		});

		$('tbody', $previewBox).sortable({
			placeholder: 'ui-state-highlight',
			forcePlaceholderSize: true,
			tolerance: 'pointer',
			cursor: 'grabbing',
			receive: function(event, ui){
				isReceive = true;
				canRemove = true;
				setEvents(ui.item);
				ui.item.removeClass('remove');
			},
			over: function(event, ui){
				canRemove = false;
				isReceive = false;
				ui.item.removeClass('remove');
				isTableEmpty();
			},
			out: function(event, ui){
				setTimeout(isTableEmpty, 90);
				
				if(!isReceive){
					canRemove = true;
					ui.item.addClass('remove');
				}
			},
			beforeStop: function(event, ui){
				if(canRemove === true) {
					ui.item.hide();
					if (confirm('Are you sure want to remove this item?')) {
						ui.item.remove();
					} else {
						ui.item.show();
					}
				}
			},
			stop: function(event, ui){
				ui.item.removeClass('remove');
				isTableEmpty();
			}
		});
		
		var $controlsBox = app.el.$controlsBox;
		var $sections = $('> div', $controlsBox);
		var imgPropIndex = $sections.index( $('#image') );
		var linkPropIndex = $sections.index( $('#hyperlink') );
		var fontPropIndex = $sections.index( $('#font') );
		
		setEvents($('tr', $previewBox));
		function setEvents($obj){
			
			$obj.on('click', function(){
				
				var $this = $(this);
				app.setObj($this);
				
				var isImg = $('img', $this).length;
				var isLink = $('a', $this).length;
				
				if(isImg){ $controlsBox.accordion('option', 'active', imgPropIndex); }
				else if(isLink){ $controlsBox.accordion('option', 'active', linkPropIndex); }
				else{ $controlsBox.accordion('option', 'active', fontPropIndex); }
				
				if(!$this.hasClass('editor')){
					app.editor.disable();
				}

			}).on('dblclick', function(){
				app.editor.enable($(this));
			});
		}
		
		function isTableEmpty(){
			var $tr = $('tr', $previewBox);
			
			if($tr.length === 1){
				var id = $tr.attr('class');
				if(!id){
					$tr.remove();
				}else{
					$('tbody', $previewBox).prepend('<tr><td width="33%"></td><td width="33%"></td><td width="33%"></td></tr>');
				}
			}
			
			if( $('tbody', $previewBox).is(':empty') ){
				$previewBox.addClass('init');
			}else{
				$previewBox.removeClass('init');
			}
		}
	}
});