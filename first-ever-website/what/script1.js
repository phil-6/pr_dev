function validate(){
		alert("Hello World");
		if(document.fContact.fName.value.length < 2)
			{alert("Please enter your full name, not just an initial.");
			return false;
			}
		if(!document.fContact.tcs.checked)
			{alert("Please tick the Terms and Conditions box.");
			return false;
			}
			
		return false;
	}



	
		
		
function eventCost(){
		
	 var eventCost = "";
        for (i = 0; i < document.getElementsByName('event').length; i++) {
            if (document.getElementsByName('event')[i].checked) {
                eventCost = document.getElementsByName('event')[i].value;
				}
    }
	document.fContact.fCost.value = eventCost
       
}

function calculateSubTotal(){
	var var1 = parseFloat(document.fContact.guests1.value);
	var eventCost = "";
        for (i = 0; i < document.getElementsByName('event').length; i++) {
            if (document.getElementsByName('event')[i].checked) {
                eventCost = document.getElementsByName('event')[i].value;
				}
    }
	var var2 = eventCost
	
	var var3 =(var1 * var2);
	
	document.fContact.fCost.value = var3
}