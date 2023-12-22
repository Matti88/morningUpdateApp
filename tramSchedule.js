let latestData = null; // Variable to store the latest fetched data


// Fetches departure data from the API
async function fetchDepartureData() {
 

    try {

        const wienerLinenen = "https://www.wienerlinien.at/ogd_realtime/monitor?activateTrafficInfo=stoerunglang&rbl=3439";
       
        fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(wienerLinenen)}`)
        .then(response => {

        if (response.ok) return JSON.parse(response.json().contents)
          throw new Error('Network response was not ok.')
        })
        .then(data => console.log(data.contents));
      
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        latestData = await JSON.parse(response.json().contents); // Update the stored data
    } catch (error) {
        console.error('Failed to fetch departure data:', error);
    }
}


/// Extracts the next five departure times from the data and formats them
function getNextFiveDepartures(data) {
    if (!data || !data.data || !data.data.monitors) {
        return [];
    }

    const departures = data.data.monitors.flatMap(monitor => 
        monitor.lines.flatMap(line => 
            line.departures.departure.map(d => {
                const dateTime = new Date(d.departureTime.timeReal);
                return dateTime.getHours().toString().padStart(2, '0') + ':' + dateTime.getMinutes().toString().padStart(2, '0');
            })
        )
    );

    return departures.slice(0, 5);
}

 
 
 
// Update the displayed times
function updateDisplay() {
    if (latestData) {
        const nextDepartures = getNextFiveDepartures(latestData);
        document.getElementById('nextTramTime').textContent = `Next departures: ${nextDepartures.join(', ')}`;
    } else {
        document.getElementById('nextTramTime').textContent = 'Waiting for data...';
    }
}


// Fetch data every hour
setInterval(fetchDepartureData, 3600000); // 3600000 milliseconds = 1 hour
fetchDepartureData(); // Initial fetch

// Update display every 2 minutes
setInterval(updateDisplay, 1200); // 120000 milliseconds = 2 minutes
updateDisplay(); // Initial display update