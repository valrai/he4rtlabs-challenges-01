
const INVALID_INPUT_CLASS = "input-invalid";
const WORKED_DAYS_ID = "workedDays";
const WORKED_HOURS_ID = "workedHours";
const REST_DAYS_ID = "restDays";

function SubmitHandler(event){

    event.preventDefault();   

    var inputElements = document.getElementsByTagName("input");
    var isValid = true;

    for (let element of inputElements){
        var validationResult = ValiteField(element);
        isValid = isValid && validationResult;
    }
    if (isValid){ 
        var projectHourValue = Round (CalculateProjectHourValue(inputElements[0].value, inputElements[1].value,
                                                                inputElements[2].value, inputElements[3].value), 2);
        
        for (let element of inputElements)
            element.value = "0";       

        var calculatorElement = document.getElementById("form-div");
        calculatorElement.style.display = 'none';
        CreateResultelement(projectHourValue);
    }

}

function GoBack(){
    var calculatorElement = document.getElementById("form-div");
    var resultLabel = document.getElementById("result-label");
    var btnSpan = document.getElementById("span-result-btn");
    resultLabel.parentElement.style.display="none";
    resultLabel.parentElement.removeChild(resultLabel);
    btnSpan.parentElement.removeChild(btnSpan);
    calculatorElement.style.display = 'block';
}

function CreateResultelement(inputValue){
    var div = document.getElementById("result-panel");
        div.style.display="block";
    var label = document.createElement("label");
        label.for = "projectHourValue";
        label.id = "result-label";
    var spanTitle = document.createElement("span");
        spanTitle.textContent = "Project Hour Value";
    var input = document.createElement("input");
        input.id = "projectHourValue"
        input.type = "text";
        input.readonly = true;
        input.value = inputValue;
        input.classList.add("valueIcon");
    var spanBtn = document.createElement("span");
        spanBtn.classList.add("submitBtn-Span");
        spanBtn.id = "span-result-btn";
    var btn = document.createElement("button");
        btn.id = "backBtn";
        btn.type = "button";
        btn.classList.add("btn");
        btn.textContent = "Back";
        btn.setAttribute("onclick","GoBack('');");
    
    div.appendChild(label);
    label.appendChild(spanTitle);
    label.appendChild(input);
    div.appendChild(spanBtn);
    spanBtn.appendChild(btn);
}

function SetValidationElement(errorMessage, id, hidenState){
    var span = document.getElementById("validationMessage-" + id);
    span.textContent = errorMessage;
    span.hidden = hidenState;
}

function ValiteField(element){
    
    var isValid = true;
    var elementValue = parseFloat(element.value); 

    SetValidationElement("", element.id, true);        
    element.classList.remove(INVALID_INPUT_CLASS);

    if (elementValue <= 0){
        SetValidationElement("*You must enter a value greater than 0 for this field.", element.id, false);
        element.classList.add(INVALID_INPUT_CLASS);
        isValid = false;
    }
    else if (element.id == WORKED_DAYS_ID || element.id == REST_DAYS_ID ){

        var workedDays = document.getElementById(WORKED_DAYS_ID);
        var restDays = document.getElementById(REST_DAYS_ID);
        var workedDaysValue = parseFloat(workedDays.value);
        var restDaysValue = parseFloat(restDays.value);

        if (workedDaysValue > 0 && restDaysValue > 0){
            SetValidationElement("", workedDays.id, true);
            SetValidationElement("", restDays.id, true);
            workedDays.classList.remove(INVALID_INPUT_CLASS);
            restDays.classList.remove(INVALID_INPUT_CLASS); 
        }

        if (element.id == REST_DAYS_ID && elementValue < 1){
            SetValidationElement("*The number of rest days must be between 1 and 7.", element.id, false);            
            element.classList.add(INVALID_INPUT_CLASS);
            isValid = false;
        } 
        else if ((workedDaysValue + restDaysValue) > 7){

            SetValidationElement("*The sum of working and rest days must not be greater than 7.", element.id, false);            
            element.classList.add(INVALID_INPUT_CLASS);
            isValid = false;                
        }    
    }
    else if (element.id == WORKED_HOURS_ID){

        if (parseFloat(element.value) > 24){
            SetValidationElement("*The number of hours must not be greater than 24.", element.id, false);            
            element.classList.add(INVALID_INPUT_CLASS);
            isValid = false;
        }
    }

    return isValid;              
}

function CalculateProjectHourValue(projectValue, workedHours, workedDays, restDays){

    return (projectValue / (workedDays * 4 * workedHours) ) + ( ( restDays * workedDays * workedHours ) )
}

function InputHandler(event){

    var element = event.target;
    ValiteField(element);    
}

function Round (num, places) {

	if (!("" + num).includes("e")) 
		return +(Math.round(num + "e+" + places)  + "e-" + places);    
    else {

		let arr = ("" + num).split("e");
		let sig = ""
		if (+arr[1] + places > 0) 
			sig = "+";		

		return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + places)) + "e-" + places);
	}
}