let storyData = {};
let currentState = "start";

// StonerockCoin fluctuating price simulator
function updateTicker() {
    const tickerEl = document.getElementById('ticker-status');
    if (!tickerEl) return;
    
    const randVal = (Math.random() * 0.00000001).toFixed(20);
    const percent = (Math.random() * -100).toFixed(4);
    tickerEl.innerHTML = `StonerockCoin: $${randVal} (${percent}%)`;
    
    if (Math.random() > 0.5) {
        tickerEl.className = "ticker-red";
    } else {
        tickerEl.className = "ticker-green";
    }
}

// Render dynamic story nodes
function renderState(stateKey) {
    currentState = stateKey;
    const state = storyData[stateKey];
    
    if (!state) {
        console.error(`State "${stateKey}" not found in story.json.`);
        return;
    }
    
    // Set Story Text
    document.getElementById('story-display').innerText = state.text;

    // Set Status Badge
    const statusContainer = document.getElementById('status-container');
    statusContainer.innerHTML = '';
    if (state.status) {
        const badge = document.createElement('span');
        badge.className = `status-badge badge-${state.status.type}`;
        badge.innerText = state.status.text;
        statusContainer.appendChild(badge);
    }

    // Set Choices
    const choicesContainer = document.getElementById('choices-display');
    choicesContainer.innerHTML = '';
    state.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        if (choice.next === 'start') {
            btn.className += ' btn-reset';
        }
        btn.innerText = choice.text;
        btn.onclick = () => renderState(choice.next);
        choicesContainer.appendChild(btn);
    });
}

// Load external JSON data on startup
async function initGame() {
    try {
        const response = await fetch('story.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        storyData = await response.json();
        renderState("start");
    } catch (error) {
        console.error("Failed to load story data:", error);
        document.getElementById('story-display').innerText = 
            "Error: Could not load the Stonerock database (story.json). Please check if the file is present in the same directory.";
    }
}

// Run initializers
document.addEventListener("DOMContentLoaded", () => {
    initGame();
    setInterval(updateTicker, 3000);
});
