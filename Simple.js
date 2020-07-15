//Setting up starting settings

var formSettings = {
    advanced: true,
    advancedSurfaces: 3
}

//------------- Calculating Foam Depths --------------
function calculateSpecificFoamTotals(targetFoam, targetRValue, targetSqFt, targetBaseFieldToUpdate, targetFormBlock = "") {

    // Setting up HTML fields to target
    var depthField = targetBaseFieldToUpdate + targetFormBlock + "-Depth";
    var costField = targetBaseFieldToUpdate + targetFormBlock + "-Cost";

    console.log(depthField);
    console.log(document.getElementById(depthField));

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
    var monthlyPayments = totalCost / ((((1 + r) ** months) - 1) / (r * (r + 1) ** months));

    //Assigning the monthly payment fields
    document.getElementById(monthlyPaymentField).innerHTML = "$" + monthlyPayments;
}

//------------- Main "calculateTotals()" Function --------------

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

    } else if (formSettings.advanced === true) {

        //Basic variables
        var totalCost = 0;

        //Looping through all of the "advanced surface" fields, assigning their data, and adding their value to "totalCost"
        for(var i = 0; i < formSettings.advancedSurfaces; i++) {

            //Building out the identifier for each advanced surface form, so we can address the items inside of it.
            var FormNameTemplateComplete = "-Surface" + i;

            var foamSelected = mainForm.elements["foamSelection" + FormNameTemplateComplete].value;
            var targetRValue = mainForm.elements["rValueSelection" + FormNameTemplateComplete].value;
            var targetSqFt = mainForm.elements["squareFootageSelection" + FormNameTemplateComplete].value;

            console.log(FormNameTemplateComplete);
            console.log(foamSelected);

            
            var surfaceCost = calculateSpecificFoamTotals(foamSelected, targetRValue, targetSqFt, "advancedOutput", FormNameTemplateComplete);

            totalCost += surfaceCost;

        }

        //Calculating and assigning the estimated monthly costs output
        calculateMonthlyPayments(totalCost, financingSelection, "advancedResultBlock");

        //Assinging the total cost output
        document.getElementById("advancedResultBlock-Cost").innerHTML = "$" + totalCost;
    }


}