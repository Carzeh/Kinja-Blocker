$(document).ready(function(){
	// Get Block List on PopUp Load
	chrome.runtime.getBackgroundPage(function(){
		if (typeof blocked != 'undefined'){
			try {	
				for (var i=0;i<chrome.extension.getBackgroundPage().blocked.length;i++){
						$('#blockedList').append("<div class='authorAnchor'>"+chrome.extension.getBackgroundPage().blocked[i]+"</div>");	
					}
				}
			finally {
				return;
			}
		}
	});	

	// Add new author to block list
	$('#author').keydown(function(event){    
    if(event.keyCode==13){

    	var author = document.getElementById('author').value;

		// Check if author already in banned list, if yes message, if no continue

		if (author.length > 1){	
			chrome.runtime.sendMessage({type: "new author", author:author},function(){
				
			});

    	};
    	document.getElementById('author').value = ""
       
   	}});


	// Clear Entire Block List
	$('#kill').click(function(){
		chrome.runtime.sendMessage({type: "clear block list"});
	})

	// Remove individual author when clicked
	$('#blockedList').on("click","div.authorAnchor",function(){
		console.log($(this).text())
		person = $(this).text();
		$("div.authorAnchor:contains('" + person + "')").remove();
		chrome.runtime.sendMessage({type: "click remove author",author:person},function(){});

	})
	 
			
}); 





// Listens for message from background to refresh/update banned list (in case user enters new author while popup is open)
chrome.runtime.onMessage.addListener(function(msg,sender){

				if (msg.type == "new blocked list" || msg.type == "new removed blocked list"){
					
					$('#blockedList').empty();
					for (var i=0;i<chrome.extension.getBackgroundPage().blocked.length;i++){
						$('#blockedList').append("<div class='authorAnchor'>"+chrome.extension.getBackgroundPage().blocked[i]+"</div>");	
					}
					
				}
				
				
		}); 