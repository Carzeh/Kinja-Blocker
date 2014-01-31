var blocked = [];

// If blocked list is empty check Google Cloud to see if blocked list has entries

if (blocked.length<1){
	console.log("Getting Stored Values...");
	getStorage();

}

// Get stored banned list from Google 

 function getStorage(){
	chrome.storage.sync.get('blocked', function(value) {
		blocked = value.blocked;
	});
} 

yes
// Refresh any tabs that are open at gawker.com

function refreshGawker(){
	chrome.tabs.query({},function(tab){

						for (var i=0;i<tab.length;i++){
							
								if (tab[i].url.indexOf('gawker') > -1){		
								chrome.tabs.reload(tab[i].id);
							
							}
						}		
				});
}

function clearStorage(author,kill){

		// If Clear All button pressed then delete entire blocked list
		if (kill == true){
			killNumber = blocked.length 
			blocked = [];
			chrome.storage.sync.set({'blocked':blocked},function(){
				chrome.runtime.sendMessage({type: "new removed blocked list",blocked:blocked});
			})
			if (killNumber > 0){refreshGawker();};
			return;
		}

		// Else remove individual blocked author from list and refresh any open tabs at gawker.com

		else {	
		chrome.storage.sync.get('blocked', function(value) {
			blocked = value.blocked;
			for (var i = 0; i < blocked.length; i++){
				if (blocked[i].toLowerCase() === author.toLowerCase()){
					index = blocked.indexOf(blocked[i]);
				}
			}
			
			if (index != -1){
				blocked.splice(index,index+1);
				console.log(blocked);
				chrome.storage.sync.set({'blocked':blocked}, function() {})
				chrome.runtime.sendMessage({type: "new removed blocked list", blocked:blocked});
				ContentUpdate();
				refreshGawker();
				
			}

			
		});}		
};

// Listen for messages from popup and content script

chrome.runtime.onMessage.addListener(
	function(request,sender,sendResponse) {

		if (request.type == "clear block list"){

			clearStorage('',true);

		}

		if(request.type == "new author") {

			if (typeof blocked === 'undefined') {

				blocked = [];
				blocked.push(request.author);
				
			}
			else {
					blocked.push(request.author);	

			}
			

			//Send updated banned list to popup.js 
			chrome.runtime.sendMessage({type: "new blocked list", blocked:blocked});

			//Send blocked list to Google Cloud Storage
			chrome.storage.sync.set({'blocked':blocked}, function() {
			console.log("Blocklist Saved: " + blocked);
				});

			
		}

	// If user clicks author, remove from banned list	
	if (request.type == "click remove author") {
		clearStorage(request.author);
		
	}	


		
		// If content script asks for banned list send it over
		if (request.type == "list on page load") {
			chrome.runtime.sendMessage({type: "blocked list on at start", blocked:blocked});
			
		}	

	

		// AFTER MESSAGE RECEIVED FROM POPUP, SEND CALLBACK TO POPUP.JS TO UPDATE BANNED LIST.	
		ContentUpdate();

		
	}
);

// Sends updated banned list to content script 
function ContentUpdate(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			
			chrome.tabs.sendMessage(tabs[0].id,{filter: "Send New Blocked List",blocked:blocked})
				
			});
}

