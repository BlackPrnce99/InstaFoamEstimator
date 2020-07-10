//--------------------Handling Foam Selection------------------
//Setting up the array to associate a depth of 2lbs with a cost/sq.ft.
var twoPoundFoamSelectionValues = new Array();
twoPoundFoamSelectionValues["1 in"] = 1.25;
twoPoundFoamSelectionValues["2 in"] = 1.75;
twoPoundFoamSelectionValues["3 in"] = 2.25;
twoPoundFoamSelectionValues["4 in"] = 2.75;

//Checking which foam was selected, comparing to a depth (if applicable), and returning the cost/sq.ft.

function getFoamCostPerSqFt() {
    var finalValue = 0;

    //setting the main form to a variable
    var mainForm = document.forms["instaFoamEstimator"];
    //setting the "Select Your Foam" radio buttons to a variable.
    var foamRadioButtons = mainForm.elements["foamSelection"];

    //checking to see which foam is selected
    for (var i = 0; i < foamRadioButtons.length; i++) {
        if (foamRadioButtons[i].checked) {
            var buttonValue = foamRadioButtons[i].value;

            //Checks to see which foam value is returned.
            if (buttonValue === "2lbs") {
                var foamDepth = mainForm.elements["twoPoundDepthSelection"].value;
                finalValue = twoPoundFoamSelectionValues[foamDepth];
                break;
            } else if (buttonValue === "1/2lbs") {
                finalValue = 2.00;
                break;
            }
        }
    }
    return finalValue;
}

//-------------------Handling the R-Value Calculations-----------------------
var twoPoundFoamRValueList = new Array();
twoPoundFoamRValueList["1 in"] = 6;
twoPoundFoamRValueList["2 in"] = 12;
twoPoundFoamRValueList["3 in"] = 18;
twoPoundFoamRValueList["4 in"] = 24;

function calculateRValue() {
    var rValue = 0;

    //setting the main form to a variable
    var mainForm = document.forms["instaFoamEstimator"];
    //setting the "Select Your Foam" radio buttons to a variable.
    var foamRadioButtons = mainForm.elements["foamSelection"];

    //checking to see which foam is selected
    for (var i = 0; i < foamRadioButtons.length; i++) {
        if (foamRadioButtons[i].checked) {
            var buttonValue = foamRadioButtons[i].value;

            //Checks to see which foam value is returned.
            if (buttonValue === "2lbs") {
                var foamDepth = mainForm.elements["twoPoundDepthSelection"].value;
                rValue = twoPoundFoamRValueList[foamDepth];
                break;
            } else if (buttonValue === "1/2lbs") {
                rValue = 2.00;
                break;
            }
        }
    }
    return rValue;
}

//-----------------------Building Out Average Savings-----------------------

function calculateAverageSavings() {
    var mainForm = document.forms["instaFoamEstimator"];
    var monthlyEnergyCosts = mainForm.elements["monthlyPower"].value;
    var savingsPercent = 0.00

    var foamRadioButtons = mainForm.elements["foamSelection"];

    //Checking which foam type was selected.
    for (var i = 0; i < foamRadioButtons.length; i++) {
        if (foamRadioButtons[i].checked) {
            var buttonValue = foamRadioButtons[i].value;
            if (buttonValue === "2lbs") {
                savingsPercent = 0.175;
                break;
            } else if (buttonValue === "1/2lbs") {
                savingsPercent = 0.10;
                break
            }
        }
    }

    var monthlyEnergySavings = monthlyEnergyCosts * savingsPercent;
    return monthlyEnergySavings;
}

//-------------------Building the Financing Options----------------------------

var financingOptionValues = new Array();
financingOptionValues["6 Months @ 0%"] = [6, 0.00];
financingOptionValues["12 Months @ 2%"] = [12, 0.02];
financingOptionValues["18 Months @ 4%"] = [18, 0.04];
financingOptionValues["24 Months @ 6%"] = [24, 0.06];

function calculateMonthlyPayments(totalCost) {
    //Setting the whole form to a variable
    var mainForm = document.forms["instaFoamEstimator"];

    //Setting this element to a variable
    var financingSelection = mainForm.elements["financingSelection"].value;

    //Checking "financingOptionValues" and using the values associated with the selection to calculate the monthly payments.
    var months = financingOptionValues[financingSelection][0];
    var financingRate = financingOptionValues[financingSelection][1];

    var monthlyPayments = totalCost / months;
    return monthlyPayments;
}


//-------------------Building the "calculateTotal()" function-----------------=
function calculateTotal() {

    var mainForm = document.forms["instaFoamEstimator"];

    //showing and hiding elements based on the foam seleciton
    var foamRadioButtons = mainForm.elements["foamSelection"];
    for(var i = 0; i < foamRadioButtons.length; i++) {
        if(foamRadioButtons[i].checked) {
            var buttonValue = foamRadioButtons[i].value;

            if(buttonValue === "2lbs") {
                var foamDepthSelectionDiv = document.querySelector("#twoPoundFoamDepth");
                foamDepthSelectionDiv.style.display = "block";
                
            } else if(buttonValue === "1/2lbs") {
                var foamDepthSelectionDiv = document.querySelector("#twoPoundFoamDepth");
                foamDepthSelectionDiv.style.display = "none";
            }
        }
    }
    //Getting the cost per square foot.
    var foamCostPerSqFt = getFoamCostPerSqFt();

    //Getting the square footage
    var squareFootage = mainForm.elements["squareFootageSelection"].value;

    //Calculating the total cost
    var totalCost = foamCostPerSqFt * squareFootage;

    //------ R Value ------
    var rValue = calculateRValue();

    //------ Energy Savings ------
    var avgSavings = calculateAverageSavings();

    //------ Financing Plan -------
    var monthlyPayment = calculateMonthlyPayments(totalCost);

    //Outputting the Values
    document.getElementById("estimatorResultsBlock-Value").innerHTML = totalCost;
    document.getElementById("sqftCostResultsBlock-Value").innerHTML = foamCostPerSqFt;
    document.getElementById("rValueResultsBlock-Value").innerHTML = rValue;
    document.getElementById("savingsResultsBlock-Value").innerHTML = avgSavings;
    document.getElementById("financingResultsBlock-Value").innerHTML = "TEMP: " + monthlyPayment
}