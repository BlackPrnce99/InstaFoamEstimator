//Setting up starting settings

var formSettings = {
    advanced: true,
    advancedSurfaces: 5,
    moreInfoExpanded: false,
    areasShowing: 1
}

//------------- Building out the swapEstimators() Function --------------

function swapEstimators() {

    // Toggling the "advanced?" setting.
    formSettings.advanced = !formSettings.advanced;

    //Getting the Simple and Advanced Elements.
    var simpleItems = document.getElementsByClassName("simple");
    var advancedItems = document.getElementsByClassName("advanced");

    //Handling the swap from the simple estimator to the advanced one.
    if (formSettings.advanced) {

        //Turning the Simple Elements off
        for (var i = 0; i < simpleItems.length; i++) {
            simpleItems[i].style.display = "none";
        }

        //Turning the Advanced Elements on
        for (var i = 0; i < advancedItems.length; i++) {
            advancedItems[i].style.display = "block";
        }

        //Swapping the text on the "Swap Estimator" button
        //document.getElementById("swapEstimatorButton").innerHTML = "Swap to Simple Estimator";

    } else if (!formSettings.advanced) {

        //Turning the Advanced Elements off
        for (var i = 0; i < advancedItems.length; i++) {
            advancedItems[i].style.display = "none";
        }

        //Turning the Simple Elements on
        for (var i = 0; i < simpleItems.length; i++) {
            simpleItems[i].style.display = "block";
        }

        //Swapping the text on the "Swap Estimator" button
        //document.getElementById("swapEstimatorButton").innerHTML = "Swap to Advanced (Multi-Surface) Estimator";
    }


}

//------------- Creating the "addSurface()" Function ---------------

function addSurface() {

    //Finding out how many areas are showing, and then revealing the next one.
    var surfaceToAdd = "surface" + formSettings.areasShowing;

    formSettings.areasShowing++;

    document.getElementById(surfaceToAdd).style.display = "block";
}

//-------------- Creating the Small "moreInfo()" Dashboard Funcation -------------

function toggleMoreInfo() {

    //Toggling the "moreInfoExpanded" setting.
    formSettings.moreInfoExpanded = !formSettings.moreInfoExpanded;

    //Toggling "More info" Elements ON, and turning OFF Quick-Look Dashboard
    if (formSettings.moreInfoExpanded) {

        var elementsToShow = document.getElementsByClassName("moreDetailsShow");
        var elementsToHide = document.getElementsByClassName("moreDetailsHide");

        for (var i = 0; i < elementsToShow.length; i++) {
            console.log(i);
            elementsToShow[i].style.display = "flex";

        }

        for (var i = 0; i < elementsToHide.length; i++) {
            console.log(i);
            elementsToHide[i].style.display = "none";

        }

        var buttons = document.getElementsByClassName("clickForMoreText");
        
        for(var i = 0; i < buttons.length; i++) {
            buttons[i].innerHTML = "(Click for Less)";
        }

    //Toggling "More info" Elements OFF, and turning ON Quick-Look Dashboard
    } else if (!formSettings.moreInfoExpanded) {

        var elementsToShow = document.getElementsByClassName("moreDetailsShow");
        var elementsToHide = document.getElementsByClassName("moreDetailsHide");

        for (var i = 0; i < elementsToShow.length; i++) {
            console.log(i);
            elementsToShow[i].style.display = "none";

        }

        for (var i = 0; i < elementsToHide.length; i++) {
            console.log(i);
            elementsToHide[i].style.display = "flex";

        }

        var buttons = document.getElementsByClassName("clickForMoreText");
        
        for(var i = 0; i < buttons.length; i++) {
            buttons[i].innerHTML = "(Click for More)";
        }
    }
}


//------------- Creating the "expandMoreInfo()" Function -------------

/*
function expandMoreInfo() {

    // Toggling the "moreInfoExpanded" boolean in formSettings
    formSettings.moreInfoExpanded = !formSettings.moreInfoExpanded;

    //Getting the "More Info" elements and putting them into an array.
    var foamMoreInfo = document.getElementsByClassName("resultsBlock-MoreInfoList");
    

    //Checking if the "More Info" section is being expanded.
    if(formSettings.moreInfoExpanded) {

        //If it is, then setting the display property to "flex"
        for(var i = 0; i < foamMoreInfo.length; i++) {
            foamMoreInfo[i].style.display = "flex"
        }

    } else if(!formSettings.moreInfoExpanded) {

        //If not, then setting the display property to "none"
        for(var i = 0; i < foamMoreInfo.length; i++) {
            foamMoreInfo[i].style.display = "none"
        }

    }
    
}
*/

//------------- Calculating Foam Depths --------------
function calculateSpecificFoamTotals(targetFoam, targetRValue, targetSqFt, targetBaseFieldToUpdate, targetFormBlock = "") {

    // Setting up HTML fields to target
    var depthField = targetBaseFieldToUpdate + targetFormBlock + "-Depth";
    var costField = targetBaseFieldToUpdate + targetFormBlock + "-Cost";

    //Calculating the total required depth of foam and costs, based on the foam being used.

    var requiredDepth = 0;
    var totalCost = 0;

    //Calculating for 2lb Foam
    if (targetFoam === "2lb" && targetRValue !== "") {

        //Rounding the Required Depth to the closest 0.5
        requiredDepth = Math.round((targetRValue / 6.5) / 0.5) * 0.5;
        console.log("1" + requiredDepth);

        //Running the calulation for 2lb foam cost ($0.75 for in 1 + $0.50 x Extra Inch)
        totalCost = (0.75 + (0.50 * (requiredDepth - 1))) * targetSqFt;

        //Calculating for 1/2lb Foam
    } else if (targetFoam === "1/2lb" && targetRValue !== "") {

        //Rounding the Required Depth to the closest 0.5
        requiredDepth = Math.round((targetRValue / 3.7) / 0.5) * 0.5;

        // Running the calculations for 1/2lbs foam cost ($0.25 / inch)
        totalCost = 0.25 * requiredDepth * targetSqFt;
    }

    console.log(targetRValue);
    console.log(requiredDepth);
    console.log(totalCost);
    //Assigning the cost and depth fields
    document.getElementById(depthField).innerHTML = requiredDepth + '\"';
    document.getElementById(costField).innerHTML = "$" + totalCost;

    return totalCost;

}

//----------- Calculating Financing Options -------------

function calculateMonthlyPayments(totalCost, financingSelection, targetBaseFieldToUpdate) {

    var financingOptionValues = new Array();
    financingOptionValues["6 Months @ 2%"] = [6, 0.02];
    financingOptionValues["12 Months @ 4%"] = [12, 0.04];
    financingOptionValues["18 Months @ 6%"] = [18, 0.06];
    financingOptionValues["24 Months @ 8%"] = [24, 0.08];

    //Checking "financingOptionValues" and using the values associated with the selection to calculate the monthly payments.
    var months = financingOptionValues[financingSelection][0];
    var financingRate = financingOptionValues[financingSelection][1];

    //Setting up HTML fields to target
    var monthlyPaymentField = targetBaseFieldToUpdate + "-MonthlyPayments";

    //Calculating the Monthly Payments
    var r = (financingRate / 12)
    var monthlyPayments = (totalCost / ((((1 + r) ** months) - 1) / (r * (r + 1) ** months))).toFixed(2);

    //Assigning the monthly payment fields
    document.getElementById(monthlyPaymentField).innerHTML = "$" + monthlyPayments;
}

//------------- MAIN "calculateTotals()" Function --------------

function calculateTotal() {

    //Setting the main form and target fields as elements
    var mainForm = document.forms["instaFoamEstimator"];
    var financingSelection = mainForm.elements["financingSelection"].value;

    if (formSettings.advanced === false) {

        //Setting the clients selections as variables.

        var targetRValue = mainForm.elements["rValueSelection"].value;
        var targetSqFt = mainForm.elements["squareFootageSelection"].value;

        //Displaying Foam Depths

        var twoPoundCost = calculateSpecificFoamTotals("2lb", targetRValue, targetSqFt, "simpleResultTwoPound");
        var halfPoundCost = calculateSpecificFoamTotals("1/2lb", targetRValue, targetSqFt, "simpleResultHalfPound");

        calculateMonthlyPayments(twoPoundCost, financingSelection, "simpleResultTwoPound");
        calculateMonthlyPayments(halfPoundCost, financingSelection, "simpleResultHalfPound");

        //Displaying the Foam Costs in the "Quick Display"
        document.getElementById("simpleResultBlockTwoPoundQuick-Cost").innerHTML = "$" + twoPoundCost;
        document.getElementById("simpleResultBlockHalfPoundQuick-Cost").innerHTML = "$" + halfPoundCost;

    } else if (formSettings.advanced === true) {

        //Basic variables
        var twoPoundTotalCost = 0;
        var halfPoundTotalCost = 0;

        //Looping through all of the "advanced surface" fields, assigning their data, and adding their value to "totalCost"
        for (var i = 0; i < formSettings.advancedSurfaces; i++) {

            //Building out the identifier for each advanced surface form, so we can address the items inside of it.
            var FormNameTemplateComplete = "-Surface" + i;
            console.log(FormNameTemplateComplete);

            //var foamSelected = mainForm.elements["foamSelection" + FormNameTemplateComplete].value;
            var targetRValue = mainForm.elements["rValueSelection" + FormNameTemplateComplete].value;
            var targetSqFt = mainForm.elements["squareFootageSelection" + FormNameTemplateComplete].value;

            console.log(targetRValue + "!!!");
            console.log(targetSqFt + "!!!");

            //Displaying the Quick, Area-Specific Results
            var twoPoundSurfaceCost = calculateSpecificFoamTotals("2lb", targetRValue, targetSqFt, "advancedOutputTwoPound", FormNameTemplateComplete);
            var halfPoundSurfaceCost = calculateSpecificFoamTotals("1/2lb", targetRValue, targetSqFt, "advancedOutputHalfPound", FormNameTemplateComplete);

            //Adding the results of Each card to the running total
            twoPoundTotalCost += twoPoundSurfaceCost;
            halfPoundTotalCost += halfPoundSurfaceCost;

        }

        
        //Calculating and assigning the estimated monthly costs output
        calculateMonthlyPayments(twoPoundTotalCost, financingSelection, "simpleResultTwoPound");
        calculateMonthlyPayments(halfPoundTotalCost, financingSelection, "simpleResultHalfPound");

        //Assinging the total cost outputs
        document.getElementById("simpleResultBlockTwoPoundQuick-Cost").innerHTML = "$" + twoPoundTotalCost;
        document.getElementById("simpleResultBlockHalfPoundQuick-Cost").innerHTML = "$" + halfPoundTotalCost;

        document.getElementById("simpleResultTwoPound-Cost").innerHTML = "$" + twoPoundTotalCost;
        document.getElementById("simpleResultHalfPound-Cost").innerHTML = "$" + halfPoundTotalCost;
    }


}

//-------------------Submitting Email Form---------------------
function submitEmail() {
    //Getting the user's email information.
    const mainForm = document.forms["emailCollection-Form"];
    const userEmail = mainForm.elements["emailCollection-Input"].value;
    const wantsToConnect = mainForm.elements["emailCollection-WantsEstimate"].checked;

    const allOptions = {
        email : userEmail,
        wantsConnect : wantsToConnect
    }
    
    fetch('https://032cc2e50e9d.ngrok.io/test', {
        method: "POST",
        headers: {
            'Content-Type' : 'text/plain'
        },
        body: JSON.stringify({
            user: {
                name: "John",
                email: "test@test.com"
            }
        })
    })
        .then(results => results.json())
        .then(results => {
            console.log(results);
        })
/*
    fetch('https://032cc2e50e9d.ngrok.io/request-quote')
        .then( (results) => {
            console.log(results);
        })
    */
}