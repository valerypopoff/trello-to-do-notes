var colored = false;
var colors = {today: "red", tomorrow: "orange", someday: "green"};


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


function hsvToRgb(h, s, v) {
	var r, g, b;
	var i;
	var f, p, q, t;
 
	// Make sure our arguments stay in-range
	h = Math.max(0, Math.min(360, h));
	s = Math.max(0, Math.min(100, s));
	v = Math.max(0, Math.min(100, v));
 
	// We accept saturation and value arguments from 0 to 100 because that's
	// how Photoshop represents those values. Internally, however, the
	// saturation and value are calculated from a range of 0 to 1. We make
	// That conversion here.
	s /= 100;
	v /= 100;
 
	if(s == 0) {
		// Achromatic (grey)
		r = g = b = v;
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}
 
	h /= 60; // sector 0 to 5
	i = Math.floor(h);
	f = h - i; // factorial part of h
	p = v * (1 - s);
	q = v * (1 - s * f);
	t = v * (1 - s * (1 - f));
 
	switch(i) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
 
		case 1:
			r = q;
			g = v;
			b = p;
			break;
 
		case 2:
			r = p;
			g = v;
			b = t;
			break;
 
		case 3:
			r = p;
			g = q;
			b = v;
			break;
 
		case 4:
			r = t;
			g = p;
			b = v;
			break;
 
		default: // case 5:
			r = v;
			g = p;
			b = q;
	}
 
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(r, g, b) 
{
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


function name2hex( name )
{
	var h = crc32(name) % 360;
	var rgb = hsvToRgb( h, 7, 92);
	
	return rgbToHex( rgb[0], rgb[1], rgb[2] );
}

var makeCRCTable = function(){
    var c;
    var crcTable = [];
    for(var n =0; n < 256; n++){
        c = n;
        for(var k =0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
}

var crc32 = function(str) {
    var crcTable = window.crcTable || (window.crcTable = makeCRCTable());
    var crc = 0 ^ (-1);

    for (var i = 0; i < str.length; i++ ) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
};



function css()
{
	$("head").append("<link id='newcss' href='"+ chrome.runtime.getURL("color.css") +"' type='text/css' rel='stylesheet' />");	
	
	//$(".focus .checklist-new-item-text").attr("placeholder", "foo");
	
	//$(".window").css("background-color", name2hex( $(".window-title-text").html() ));	
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
			//console.log( date );
			
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
			//console.log( then );
			
			if( then.valueOf() <= today.valueOf() )
			{
				//this.style.color = colors["today"];

				$(this).removeClass( "today" );
				$(this).removeClass( "tomorrow" );
				$(this).removeClass( "someday" );

				$(this).addClass( "today" );
				//console.log("today");
			} else

			if( then.valueOf() == tomorrow.valueOf() )
			{
				//this.style.color = colors["tomorrow"];
				$(this).removeClass( "today" );
				$(this).removeClass( "tomorrow" );
				$(this).removeClass( "someday" );

				$(this).addClass( "tomorrow" );
				//console.log("tomorrow");
			} else
			
			if( then.valueOf() > tomorrow.valueOf() )
			{			
				//this.style.color = colors["tomorrow"];
				$(this).removeClass( "today" );
				$(this).removeClass( "tomorrow" );
				$(this).removeClass( "someday" );

				$(this).addClass( "someday" );
				//this.style.color = colors["someday"];
				//console.log("someday");
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







//$(document).ready(function () 
//$(window).onload(function () 
//$( document ).ajaxComplete(function()
//$(".window-wrapper").hover(function()
/*
$(".window-header-icon").hover(function()
{
	console.log("gotcha");
	//color();
});
*/


/*
( !$(".window-header-icon").hover(function(){console.log("gotcha");}).length )
{
	console.log("trying");
};
*/