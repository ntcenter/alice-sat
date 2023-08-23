//Declare global chart variable - I don't want to, but Anychart says I have to (sigh)
let chart;

window.onload = function() {
    
    //Set variables for each question group (phase) and assign names (for use in html file)
    const groupNames = {
        G1: "Phase 1: Setting up clear expectations (feedup)",
        G2: "Phase 2: Reflecting on how to observe, collect data, measure…",
        G3: "Phase 3: Analysing observations, data…",
        G4: "Phase 4: Communicating about learning trajectories (feedback)",
        G5: "Phase 5: Acting consequently, adapting learning (feedforward)"
    };
        
    //Make the calculations for the results by groups of questions (phases) and assign to 'total' variable 
    function calculateGroupScore(groupId, scoreId, feedbackId, feedbackMessages) {
        let total = Array.from(document.getElementById(groupId).querySelectorAll('input[type="radio"]:checked'))
         .reduce((acc, radio) => acc + Number(radio.value), 0);

        //Set rules for which feedback text to use based on the result tier
        let feedback = total < 8 ? feedbackMessages.low : total < 16 ? feedbackMessages.medium : feedbackMessages.high;
        let groupFullName = groupNames[groupId];

        //Format the results/feedback section
        document.getElementById(scoreId).textContent = `${groupFullName} | Your score: ${total}/20`;
        document.getElementById(feedbackId).textContent = feedback;

    return total;
    }

    //Provide feedback messages for each of the result tiers (msgs will be specific for each phase, hence the prima facie repeats)
    const feedbackMessages = {
        G1: {
            low: "You suck at this big time. Why not look for another job? Today?",
            medium: "Mediocrity is your best achievement.",
            high: "You are suspiciously good at this. Did you lie or cheat with your answers?"
        },
        G2: {
            low: "You suck at this big time. Why not look for another job? Today?",
            medium: "Mediocrity is your best achievement.",
            high: "You are suspiciously good at this. Did you lie or cheat with your answers?"
        },
        G3: {
            low: "You suck at this big time. Why not look for another job? Today?",
            medium: "Mediocrity is your best achievement.",
            high: "You are suspiciously good at this. Did you lie or cheat with your answers?"
        },
        G4: {
            low: "You suck at this big time. Why not look for another job? Today?",
            medium: "Mediocrity is your best achievement.",
            high: "You are suspiciously good at this. Did you lie or cheat with your answers?"
        },
        G5: {
            low: "You suck at this big time. Why not look for another job? Today?",
            medium: "Mediocrity is your best achievement.",
            high: "You are suspiciously good at this. Did you lie or cheat with your answers?"
        }
    };

    function validateAllQuestionsAnswered() {
        //return validateAllQuestionsAnsweredAndy();
        return validateAllQuestionsAnsweredVladi();
    }

    //Check if all questions are answered
    function validateAllQuestionsAnsweredAndy() {
        const groupIds = ['G1', 'G2', 'G3', 'G4', 'G5'];
        
        return groupIds.every(groupId => {
            console.log("validateAllQuestionsAnswered() groupId", groupId)
            const totalRadioButtons = document.getElementById(groupId).querySelectorAll('.likert input[type="radio"]').length;
            console.log("validateAllQuestionsAnswered() totalRadioButtons", totalRadioButtons)
            const checkedRadioButtons = document.getElementById(groupId).querySelectorAll('.likert input[type="radio"]:checked').length;
            console.log("validateAllQuestionsAnswered() checkedRadioButtons", checkedRadioButtons)

            // Проверява дали във всяка група има по 4 бутона чекнати
            // if (checkedRadioButtons == 4) return true;
            // return false;
            
            // Не пропуска дори през G1, понеже всяка група има 20 радиобутона, а макс 4 могат да са чекнати
            return totalRadioButtons === checkedRadioButtons;
        });
    }

    //Check if all questions are answered
    function validateAllQuestionsAnsweredVladi() {
        const groupIds = ['G1', 'G2', 'G3', 'G4', 'G5'];
        
        return groupIds.every(groupId => {
            //console.log("validateAllQuestionsAnswered() groupId", groupId)

            const radioButtons = document.getElementById(groupId).querySelectorAll('.likert input[type="radio"]');
            //console.log("validateAllQuestionsAnswered() radioButtons", radioButtons)
            const checkedRadioButtons = document.getElementById(groupId).querySelectorAll('.likert input[type="radio"]:checked');
            //console.log("validateAllQuestionsAnswered() checkedRadioButtons", checkedRadioButtons)

            // Събираме имената на всичките радиобутони, без повторения, напр ['G3xQ1', 'G3xQ2', 'G3xQ3', 'G3xQ4']
            const radioButtonsNames = Array.from(radioButtons).reduce(function(acc, radioButton) {
                const radioButonName = radioButton.getAttribute("name");
                if (acc.indexOf(radioButonName) < 0) acc.push(radioButonName);
                return acc;
            }, []);
            //console.log("validateAllQuestionsAnswered() radioButtonsNames", radioButtonsNames)

            // var radioButtonsNames = []
            // for (i = 0, iLim = radioButtons.length; i < iLim; i++) {
            //     const radioButonName = radioButton.getAttribute("name");
            //     if (radioButtonsNames.indexOf(radioButonName) < 0) radioButtonsNames.push(radioButonName);
            // }

            // Събираме имената само на ЧЕКнатите радиобутони, без повторения, напр ['G3xQ1', 'G3xQ3', 'G3xQ4']
            const checkedRadioButtonNames = Array.from(checkedRadioButtons).reduce(function(acc, radioButton) {
                const radioButonName = radioButton.getAttribute("name");
                if (acc.indexOf(radioButonName) < 0) acc.push(radioButonName);
                return acc;
            }, []);
            //console.log("validateAllQuestionsAnswered() checkedRadioButtonNames", checkedRadioButtonNames)

                   
            return radioButtonsNames.length === checkedRadioButtonNames.length;
        });
    }    


// Prepare results and feedback messages on pressing the Submit button
window.calculateScore = function () {
    if (validateAllQuestionsAnswered()) {
        const scores = ['G1', 'G2', 'G3', 'G4', 'G5'].map(groupId => 
            calculateGroupScore(groupId, `score${groupId}`, `feedback${groupId}Msg`, feedbackMessages[groupId])
        );

        // Check if a previous instance of the chart exists and disposes of it if it finds one 
        // (for answer change and recalc/redraw on re-click Submit)
        if (chart) {
            chart.dispose();
        }
  
        chart = anychart.radar();

        // Supply data and labels for the chart
        const data = scores.map((score, index) => ({ x: `Phase ${index + 1}`, value: score }));
        
        // Format chart area, line and scale
        let series = chart.area(data);
        series.fill("rgba(139, 245, 39, 0.66)");
        series.stroke("rgba(139, 245, 39, 1)");
        chart.yScale().maximum(20);
        chart.yScale().minimum(0);

        // Disable chart title
        const title = chart.title();
        title.enabled(false);

        // Link to the html container where to place the chart
        chart.container("chartContainer");

        // Actually draw the chart  
        chart.draw();
    } else {
        // Display browser alert if at least one question is unanswered      
        alert('You eejit! You need to answer all questions! How am I supposed to give you feedback if you do not cooperate?!');
    }
}

}