var tabID = null
var windowID = null
var cmdActive = false
var savedHeader = createHeader()
var savedTab = null
var items = []

document.addEventListener("DOMContentLoaded", function(event) {
	getResults()
});


function createHeader() {
	var header = document.createElement("div");
	header.innerHTML = `Tab Scroll`;
	header.classList.add('header')
	return header;
}

function getResults(){
	chrome.tabs.query({currentWindow: true}, function (tabs) {
    	showResults(tabs)
    });
}

function showResults(tabs) {
    var resultsElement = document.getElementById("tabList");
    
    tabs.sort(function (a, b) {
		return (a.active === b.active)? 0 : a? -1 : 1;
	}).forEach(function(tab,index) {
		var listItem = document.createElement("div"); // we want a DIV element instead of LI
		listItem.innerHTML = `${tab.title}`;
		listItem.classList.add('item');
		listItem.addEventListener('click', function() {
		   clickedTab(tab)
		});


		if(tab.active){
			listItem.classList.add('active')
			savedTab = listItem	
		}

		items.push(listItem)

	   	if(index === tabs.length - 1){
	   		resultsElement.appendChild(savedHeader);
			resultsElement.appendChild(savedTab);

	   		items.forEach(function(tab,index) {
	   			if(savedTab === tab ){return;}

	   			console.log(tab,index)
	   			resultsElement.appendChild(tab);
	   		})
	   	}

    })

	
}

// document.addEventListener('scroll', (event) => {
//   	if (cmdActive) {
//   		switchTab()
//   	}
// }, false);

// document.addEventListener('keydown', (event) => {
//   const keyName = event.key;
//   if (keyName.toLowerCase() === 'meta') {
//   		cmdActive = true
//   }
// }, false);

// document.addEventListener('keyup', (event) => {
//   	const keyName = event.key;
//   	if (keyName.toLowerCase() === 'meta') {
//   		cmdActive = false
//   	}
// }, false);
function clickedTab(tab) {
	switchTab(tab)
}

function switchTab(tab = null){
	if(tab){
		chrome.tabs.query({index: (tab.index)}, function(nextTabsArray){

	        // There is no next tab (only 1 tab or user is on last tab)
	        if( nextTabsArray.length < 1 ) return;
	        //go
	        chrome.tabs.update(nextTabsArray[0].id, {active: true})

	    });
		return
	}

	chrome.tabs.query({ currentWindow: true }, (tabs) => {
	   	if( tabs.length < 2 ) return;
	   	
	    // Else query tab with incremented index (e.g. next tab):
	    chrome.tabs.query({index: (tabs[0].index+1)}, function(nextTabsArray){

	        // There is no next tab (only 1 tab or user is on last tab)
	        if( nextTabsArray.length < 1 ) return;
	        // Else, yay! There is a next tab, lets go!
	        // chrome.tabs.update(nextTabsArray[0].id, {active: true})

	    });
	});

}

// chrome.runtime.onMessage.addListener(function(message, callback) {
//     if (message.data === 'switch_tabs') {
//     	console.log('testing')
//     	// switchTabs();
//     } 
//     // else if (message.data == “runLogic”) {
//     //   chrome.tabs.executeScript({file: 'logic.js'});
//     // } else if (message.data == “changeColor”) {
//     //   chrome.tabs.executeScript(
//     //       {code: 'document.body.style.backgroundColor="orange"'});
//     // };
// });

// function switchTabs(){
// 	chrome.tabs.query({currentWindow: true, active: true},(tabs) =>{
// 		const curr_tab = tabs[0]
// 		if(curr_tab.index < tabs.length-1){
// 			const new_tab = chrome.tabs.query({index: 1}, function(tabs) { /* blah */ } );
			
// 			if(new_tab){
// 				alert(new_tab.id);
// 				chrome.tabs.update(new_tab.id, {active: true});
// 			}
// 		}
// 	});
// }