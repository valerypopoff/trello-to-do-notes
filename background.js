chrome.browserAction.onClicked.addListener(function(tab) 
{
	chrome.windows.update(tab.windowId, 
	{
		//height: newHeight,
		width: 300
	});

    chrome.tabs.executeScript(null, {code: "do_magic()"});
  
});

	