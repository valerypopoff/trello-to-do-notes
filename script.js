/*
$(document).ready(function ()  
{
	

	if( window.name != "small" )
	{
		var newWin = window.open( window.location.href , "small", "menubar=yes, toolbar=yes, left=" + window.screenX + ", top=" + window.screenY + ", width=" + window.outerWidth + ", height="+window.outerHeight);
		window.close();
	}


});	

*/

if (window.top === window) 
{



$(document).ready(function ()  
{
	var time = 0;
	
	if( bowser.safari )
	time = 1000;

	if( bowser.chrome )
	time = 500;
	
	setTimeout( all_stuff, time );	
});	


} 