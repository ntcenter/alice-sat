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

    //Check if all questions are answered
    function validateAllQuestionsAnswered() {
        const groupIds = ['G1', 'G2', 'G3', 'G4', 'G5'];
        return groupIds.every(groupId => document.getElementById(groupId).querySelectorAll('.likert input[type="radio"]:checked').length > 0);
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