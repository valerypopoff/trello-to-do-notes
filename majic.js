var colored = false;
var resize_bound = false;
var keys_bound = false;
var updater = undefined;

if ( bowser.safari )
{
	//console.log("im safari");
	var name = safari.extension.baseURI + 'color.css';
	var size = 550;
} 
else if ( bowser.chrome )
{
	//console.log("im chrome");
	var name = chrome.runtime.getURL("color.css");
	var size = 450;
	
} 
else
{
	//console.log("im another browser");
	var name = chrome.runtime.getURL("color.css");
	var size = 650;
}

var months = 
{
	"января":0, 
	"январь":0, 
	"янв":0, 
	"january":0, 
	"jan":0, 
	
	"февраля":1, 
	"февраль":1, 
	"фев":1, 
	"february":1, 
	"feb":1, 

	"марта":2, 
	"март":2, 
	"мар":2, 
	"march":2, 
	"mar":2, 

	"апреля":3, 
	"апрель":3, 
	"апр":3, 
	"april":3, 
	"apr":3, 

	"мая":4, 
	"май":4, 
	"may":4, 

	"июня":5, 
	"июнь":5, 
	"июн":5, 
	"june":5, 
	"jun":5, 

	"июля":6, 
	"июль":6, 
	"июл":6, 
	"july":6, 
	"jul":6, 

	"августа":7, 
	"август":7, 
	"авг":7, 
	"august":7, 
	"aug":7, 

	"сентября":8, 
	"сентябрь":8, 
	"сен":8, 
	"september":8, 
	"sep":8, 

	"октября":9, 
	"октябрь":9, 
	"окт":9, 
	"october":9, 
	"oct":9, 

	"ноября":10, 
	"ноябрь":10, 
	"ноя":10, 
	"november":10, 
	"nov":10, 

	"декабря":11,
	"декабрь":11,
	"дек":11,
	"december":11,
	"dec":11
};

function getLang()
{
	if (navigator.languages != undefined) 
		return navigator.languages[0]; 
	else 
		return navigator.language;
}

function css()
{
	$("head").append("<link id='newcss' href='"+ name +"' type='text/css' rel='stylesheet' />");	
}

function parse_dates()
{
	$(".checklist-item").not(".checklist-item-state-complete").each(function(i)
	{
		var text = $(this).find(".checklist-item-details-text").text();
		var splt = text.split("/");

		var italic = $(this).find("em").length;
		
		
		// если начинается с --
		if( text.indexOf("  ") == 0 )
			$(this).addClass( "sublist" );
		else
			$(this).removeClass( "sublist" );


		// если курсив
		if( italic > 0 )
			$(this).addClass( "italic" );
		else
			$(this).removeClass( "italic" );


		//если есть хоть одна косая черта
		if( splt.length > 1 )
		{			
			var date = splt[splt.length-1];
			date = $.trim(date);
			
			
			var splt2 = date.split(" ");
			
			//если после косой черты два слова
			if( splt2.length > 1 )
			{
				var day;
				var month;

				if( isNaN(parseInt(splt2[0])) )
				{
					month = splt2[0];				
					day = splt2[1];
				} else
				{
					day = splt2[0];
					month = splt2[1];
				}
			
				//console.log(parseInt(splt2[0]) + "--" + (parseInt(splt2[0]) === 'NaN'));
				//console.log( "day: " + day + "--" + "month: " + months[month.toLowerCase()] );

				var now = new Date;
				var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				var tomorrow = new Date(today.valueOf() + 86400000);

				var then = new Date( now.getFullYear(), months[month.toLowerCase()], parseInt(day));
				//console.log(then);
			
				if( then == 'Invalid Date' )
				{
					$(this).removeClass( "today" );
					$(this).removeClass( "tomorrow" );
					$(this).removeClass( "someday" );
					
					return;
				} 

				if( 
					(then.valueOf() <= today.valueOf() && (( today.valueOf() - then.valueOf() ) <  1000*60*60*24*365/2)) || 
				 	(then.valueOf() >  today.valueOf() && (( then.valueOf() - today.valueOf() ) >= 1000*60*60*24*365/2))
				)
				{
					$(this).removeClass( "today" );
					$(this).removeClass( "tomorrow" );
					$(this).removeClass( "someday" );

					$(this).addClass( "today" );
				} else

				if( then.valueOf() == tomorrow.valueOf() )
				{
					$(this).removeClass( "today" );
					$(this).removeClass( "tomorrow" );
					$(this).removeClass( "someday" );

					$(this).addClass( "tomorrow" );
				} else
			
				if( then.valueOf() > tomorrow.valueOf() )
				{			
					$(this).removeClass( "today" );
					$(this).removeClass( "tomorrow" );
					$(this).removeClass( "someday" );

					$(this).addClass( "someday" );
				}			
			} else //если после косой черты менее двух слов
			{
				$(this).removeClass( "today" );
				$(this).removeClass( "tomorrow" );
				$(this).removeClass( "someday" );
				
				//console.log("no date");
			}
		} else //если вообще нет косой черты
		{
			$(this).removeClass( "today" );
			$(this).removeClass( "tomorrow" );
			$(this).removeClass( "someday" );
		}
		
	});

}

function do_magic(force, from_button)
{
	if( colored && !force)
	return;
	
	//if ( bowser.safari )
		//window.resizeTo(350, window.outerHeight);

	if( from_button && window.locationbar.visible )
	{
		var newwin = window.open(window.location.href,"window_"+Math.round(Math.random()*100000),'height=200, width=350');
		
		//window.close();
		if( from_button )
		return;
	}


	if( !colored )
		css();

	parse_dates();

	$(".checklist").off("DOMSubtreeModified").bind("DOMSubtreeModified", function() 
	{
		parse_dates();
	});
	
	if( !keys_bound )
	{
		keys_bound = true;

		$(document).off("keydown").on("keydown", function(e) 
		{ 
	    	// Mark red
	    	if( e.shiftKey && ( e.which == 77 ) && document.activeElement.type != "textarea" )
	 		{
				//console.log(document.activeElement.type)

				if( !$(".window").hasClass("marked") ) 
					$(".window").addClass( "marked" )
				else
					$(".window").removeClass( "marked" )			
			}    			

	    	// Mark inactive
	    	if( e.shiftKey && ( e.which == 85 ) && document.activeElement.type != "textarea" )
	 		{
				if( !$(".window-wrapper").hasClass("inactive") ) 
					$(".window-wrapper").addClass( "inactive" )
				else
					$(".window-wrapper").removeClass( "inactive" )			
			}    			

			// Insert today's date
			if( e.metaKey && e.altKey && e.which == 84 && document.activeElement.type == "textarea" )
			{
				//console.log("T")
				var date = (new Date).getDate();
				var addendum = (new Date).toLocaleString(getLang(), { month: 'short' }).substr(0,3);
				
				document.activeElement.value += " / " + date + " " + addendum;

				var begin_pos = document.activeElement.value.length-(""+date+" "+addendum).length
				document.activeElement.setSelectionRange(begin_pos, begin_pos + (""+date).length)
			}
		});
	}

}

function undo_magic()
{
	clearTimeout(updater);

	$("#newcss").remove();
	
	//$(".checklist").off("DOMSubtreeModified").bind("DOMSubtreeModified", undefined );
	$(".checklist").off("DOMSubtreeModified");
}



function all_stuff()
{
	if( /*$(window).width()*/ window.outerWidth <= size )
	do_magic();

	if( !resize_bound )
	{
		resize_bound = true;

		$(window).off("resize").bind("resize", function() 
		{
			if( /*$(window).width()*/ window.outerWidth <= size )
			{
				do_magic();
				colored = true;
			}
			else
			{
				undo_magic();	
				colored = false;
			}
		});
	}

	
	
	// Update every 5 mins --------
	
	clearTimeout(updater);

	updater = setInterval( ()=>
	{
		if( /*$(window).width()*/ window.outerWidth <= size )
		{
			//force color
			do_magic(true);
			colored = true;
		}
	
	}, 300000 ); // 300 sec
}






