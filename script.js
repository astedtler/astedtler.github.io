// Client ID and API key from the Developer Console
var CLIENT_ID = '409649548615-c25f2opj1rg6i1gmgntnpnvbvfvjre8s.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCe2XcN2deHtgHnFCQp46W2mThHrSI1Oh8';

// Array to store event colors
var eventColors = {};

// Array to store event data
var eventData = [];

// Load the Google Calendar API
gapi.load('client', initClient);

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
    scope: "https://www.googleapis.com/auth/calendar.readonly"
  }).then(function () {
    // Fetch events
    fetchEvents();
  });
}

function fetchEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    
    if (events.length > 0) {
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var startTime = event.start.dateTime || event.start.date;
        var endTime = event.end.dateTime || event.end.date;
        var title = event.summary;
        var color = event.colorId || '1'; // Default color

        // Store event color
        eventColors[event.id] = color;

        // Store event data
        eventData.push({
          title: title,
          start: startTime,
          end: endTime,
          color: color
        });
      }

      renderEvents();
    }
  });
}

function renderEvents() {
  var calendarContainer = document.getElementById('calendar');

  for (var i = 0; i < eventData.length; i++) {
    var event = eventData[i];
    var eventDiv = document.createElement('div');
    eventDiv.className = 'event';
    eventDiv.style.backgroundColor = getColor(event.color);
    eventDiv.innerHTML = '<strong>' + event.title + '</strong><br>' + event.start + ' - ' + event.end;
    calendarContainer.appendChild(eventDiv);
  }
}

function getColor(colorId) {
  // Map Google Calendar color IDs to corresponding colors
  // You can define your own color mappings as needed
  switch (colorId) {
    case '11':
      return 'red';
    case '7':
      return 'cyan';
    case '5':
      return 'yellow';
    // Add more color mappings as needed
    default:
      return 'black';
  }
}
