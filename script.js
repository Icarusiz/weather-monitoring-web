// ==========================================
// FIREBASE DATABASE
// ==========================================

const FIREBASE_URL =
    "https://weather-monitor-801e8-default-rtdb.asia-southeast1.firebasedatabase.app";


// ==========================================
// HTML ELEMENTS
// ==========================================

const temperatureElement =
    document.getElementById("temperature");

const humidityElement =
    document.getElementById("humidity");

const rainElement =
    document.getElementById("rain");

const soilElement =
    document.getElementById("soil");

const rainStatusElement =
    document.getElementById("rainStatus");

const soilStatusElement =
    document.getElementById("soilStatus");

const connectionStatus =
    document.getElementById("connectionStatus");

const statusDot =
    document.getElementById("statusDot");

const lastUpdateElement =
    document.getElementById("lastUpdate");


// ==========================================
// CHART DATA
// ==========================================

const timeLabels = [];
const temperatureData = [];
const humidityData = [];


// ==========================================
// TEMPERATURE CHART
// ==========================================

const temperatureChart =
    new Chart(
        document.getElementById("temperatureChart"),
        {
            type: "line",

            data: {
                labels: timeLabels,

                datasets: [
                    {
                        label: "Temperature (°C)",

                        data: temperatureData,

                        borderWidth: 2,

                        tension: 0.3,

                        fill: false
                    }
                ]
            },

            options: {
                responsive: true,

                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        }
    );


// ==========================================
// HUMIDITY CHART
// ==========================================

const humidityChart =
    new Chart(
        document.getElementById("humidityChart"),
        {
            type: "line",

            data: {
                labels: timeLabels,

                datasets: [
                    {
                        label: "Humidity (%)",

                        data: humidityData,

                        borderWidth: 2,

                        tension: 0.3,

                        fill: false
                    }
                ]
            },

            options: {
                responsive: true,

                scales: {
                    y: {
                        beginAtZero: true,

                        max: 100
                    }
                }
            }
        }
    );


// ==========================================
// GET DATA FROM FIREBASE
// ==========================================

async function getWeatherData() {

    try {

        const response =
            await fetch(
                FIREBASE_URL +
                "/Weather/footballField.json"
            );

        if (!response.ok) {

            throw new Error(
                "Firebase connection failed"
            );
        }

        const data =
            await response.json();


        // ==================================
        // CHECK DATA
        // ==================================

        if (data === null) {

            connectionStatus.textContent =
                "Connected - No data";

            statusDot.style.background =
                "#f59e0b";

            return;
        }


        // ==================================
        // GET VALUES
        // ==================================

        const temperature =
            Number(data.temperature);

        const humidity =
            Number(data.humidity);

        const rain =
            data.rain;

        const soil =
            Number(data.soil);


        // ==================================
        // DISPLAY TEMPERATURE
        // ==================================

        temperatureElement.textContent =
            temperature.toFixed(2);


        // ==================================
        // DISPLAY HUMIDITY
        // ==================================

        humidityElement.textContent =
            humidity.toFixed(2);


        // ==================================
        // DISPLAY RAIN
        // ==================================

        rainElement.textContent =
            rain;


        // ==================================
        // DISPLAY SOIL
        // ==================================

        soilElement.textContent =
            soil + " %";


        // ==================================
        // RAIN STATUS
        // ==================================

        if (rain === "RAIN") {

            rainStatusElement.textContent =
                "RAIN DETECTED";

        } else {

            rainStatusElement.textContent =
                "NO RAIN";
        }


        // ==================================
        // SOIL STATUS
        // ==================================

        if (soil < 30) {

            soilStatusElement.textContent =
                "DRY SOIL";

        } else if (soil < 70) {

            soilStatusElement.textContent =
                "NORMAL";

        } else {

            soilStatusElement.textContent =
                "WET SOIL";
        }


        // ==================================
        // CONNECTION STATUS
        // ==================================

        connectionStatus.textContent =
            "Firebase Connected";

        statusDot.style.background =
            "#22c55e";


        // ==================================
        // LAST UPDATE
        // ==================================

        const now =
            new Date();

        lastUpdateElement.textContent =
            now.toLocaleTimeString();


        // ==================================
        // UPDATE CHART
        // ==================================

        const currentTime =
            now.toLocaleTimeString();

        timeLabels.push(currentTime);

        temperatureData.push(
            temperature
        );

        humidityData.push(
            humidity
        );


        // Keep latest 10 readings

        if (timeLabels.length > 10) {

            timeLabels.shift();

            temperatureData.shift();

            humidityData.shift();
        }


        temperatureChart.update();

        humidityChart.update();

    }

    catch (error) {

        console.error(error);

        connectionStatus.textContent =
            "Firebase Disconnected";

        statusDot.style.background =
            "#ef4444";
    }
}


// ==========================================
// START
// ==========================================

getWeatherData();


// ==========================================
// UPDATE EVERY 3 SECONDS
// ==========================================

setInterval(
    getWeatherData,
    3000
);