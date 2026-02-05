var stateToGoTo = false;
var tvstate = true;
var timeSinceStateToGoTo = 5001;
var numdet = 1; // Simulated 1 face detected

console.log("State: TV ON, Timer expired, Face detected (numdet=1)");

// The buggy logic from line 53
try {
    if (numdet.length > 0) {
        console.log("[BUGGY LOGIC] Face detected. Keeping TV ON.");
    } else {
        console.log("[BUGGY LOGIC] Face not detected. Turning TV OFF. (Reproduced!)");
    }
} catch (e) {
    console.log("[BUGGY LOGIC] Error:", e.message);
}

// The fixed logic
try {
    if (numdet > 0) {
        console.log("[FIXED LOGIC] Face detected. Keeping TV ON.");
    } else {
        console.log("[FIXED LOGIC] Face not detected. Turning TV OFF.");
    }
} catch (e) {
    console.log("[FIXED LOGIC] Error:", e.message);
}
