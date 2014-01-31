$(document).ready(function(){
	// Check to see if there is blocked list on page load and filter if there is...
	chrome.runtime.sendMessage({type: "list on page load"},function(response){
		PageLoadFiltering(response.blocked);
	});
});

// Filter gawker page using blocked list

function PageLoadFiltering(personList){
	for (var i=0;i<personList.length;i++){
			Filtering(personList[i]);	
	};
};

// Alter Gawker homepage HTML via jQuery to remove author passed as argument to Filtering

function Filtering(person){

	// Removes input case sensitivity
	$.extend($.expr[":"], {"containsNC": function(elem, i, match, array) {
		return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
		}
	});

	// Filters input
	$( "a:containsNC('" + person + "')" ).closest('.post-wrapper.js_post-wrapper.wide.postlist-dense').remove();
	$( ".text-upper:containsNC('" + person + "')" ).closest('.post-wrapper.js_post-wrapper.wide.postlist-dense').remove();
	$( "a:containsNC('" + person + "')" ).closest('.post-wrapper.js_post-wrapper.postlist-dense').remove(); 
	
};


chrome.runtime.onMessage.addListener(function(msg,sender){
	if (msg.filter == "Send New Blocked List"){
		
		// Start Filtering Again After New Banned List Received
			
			PageLoadFiltering(msg.blocked);	

	}
			
}); 