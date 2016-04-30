var colored = false;

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


function css()
{
	$("head").append("<link id='newcss' href='"+ chrome.runtime.getURL("color.css") +"' type='text/css' rel='stylesheet' />");		
}

function color_dates()
{
	$(".checklist-item").not(".checklist-item-state-complete").each(function(i)
	{
		var text = $(this).find(".checklist-item-details-text").text();
		var splt = text.split("/");
		
		if( splt.length > 1 )
		{
			var date = splt[splt.length-1];
			date = $.trim(date);
			
			var splt2 = date.split(" ");

			/*
			var day = splt2[0];
			var month = splt2[1];
			*/

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
			
			if( then.valueOf() <= today.valueOf() )
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
		}
		
		
	});

}

function do_magic()
{
	if( colored )
	return;
	
	css();
	color_dates();

	$(".checklist").bind("DOMSubtreeModified", function() 
	{
		color_dates();
	});
	
	$(document).on("keydown", function(e) 
	{ 
    	if ( e.shiftKey && ( e.which == 77 ) )
 		{
			if( !$(".window").hasClass("marked") ) 
			$(".window").addClass( "marked" )
			
			else
			$(".window").removeClass( "marked" )			
		}    			
	});

	colored = true;
}

function undo_magic()
{
	if( !colored )
	return;

	$("#newcss").remove();
	
	$(".checklist").bind("DOMSubtreeModified", undefined );

	colored = false;
}

$(document).ready(function ()  
{
	if( $(window).width() <= 500 )
	do_magic();

	$(window).bind("resize", function() 
	{
		if( $(window).width() <= 500 )
		{
			do_magic();
		}
		else undo_magic();	
	});
});



