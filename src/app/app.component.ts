import { Component } from '@angular/core';
import { ITabNames } from './app.model';

declare var gapi: any;
const hoursFromNow = (n) => new Date(Date.now() + n * 1000 * 60 * 60).toISOString();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'itrackon';
  tabSelection: ITabNames = 'ADD_EVENTS';
  calendarItems: any[];
  CLIENT_ID = '1072496352665-dlk9s9b9fquvrb09v5lr2s2covet6lls.apps.googleusercontent.com';
  API_KEY = 'AIzaSyDVUL9dnOtJxNbun5rY-AVkhAxezsQrccw';
  DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  SCOPES = 'https://www.googleapis.com/auth/calendar';
  authorizeButton = document.getElementById('authorize_button');
  signoutButton = document.getElementById('signout_button');
  constructor() {
    this.createCalendarScript();

  }
  createCalendarScript() {
    const that = this;
    function loadScript(scriptUrl) {
      const script = document.createElement('script');
      script.src = scriptUrl;
      document.body.appendChild(script);

      return new Promise((res, rej) => {
        script.onload = () => {
          res();
        };
        script.onerror = () => {
          rej();
        };
      });
    }

    loadScript('https://apis.google.com/js/api.js')
      .then(() => {
        that.handleClientLoad();
      })
      .catch(() => {
        console.error('Script loading failed :( ');
      });
  }
  selectedTab(selectedTab: ITabNames) {
    this.tabSelection = selectedTab;
  }
  getClass(tabName: ITabNames) {
    let classList = 'tabs';
    if (this.tabSelection === tabName) {
      classList = 'tabs selectedTab';
    }
    return classList;
  }
  handleClientLoad() {
    gapi.load('client:auth2', this.initClient);
  }
  initClient() {
    const that = this;
    gapi.client.init({
      apiKey: 'AIzaSyDVUL9dnOtJxNbun5rY-AVkhAxezsQrccw',
      clientId: '1072496352665-dlk9s9b9fquvrb09v5lr2s2covet6lls.apps.googleusercontent.com',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar.events'
    })
      .catch((error) => {
        console.log('error', error);
      });
  }
  updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      this.authorizeButton.style.display = 'none';
      this.signoutButton.style.display = 'block';
      this.listUpcomingEvents();
    } else {
      this.authorizeButton.style.display = 'block';
      this.signoutButton.style.display = 'none';
    }
  }
  listUpcomingEvents() {
    gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime'
    }).then((response) => {
      console.log('succes res', response);
      // var events = response.result.items;
      // appendPre('Upcoming events:');

      // if (events.length > 0) {
      //     for (i = 0; i < events.length; i++) {
      //         var event = events[i];
      //         var when = event.start.dateTime;
      //         if (!when) {
      //             when = event.start.date;
      //         }
      //         appendPre(event.summary + ' (' + when + ')')
      //     }
      // } else {
      //     appendPre('No upcoming events found.');
      // }
    });
  }

  gmailSignInDialog() {
    gapi.auth2.getAuthInstance().signIn();
  }
  isGmailSignedIn(): boolean {
    return gapi.auth2.getAuthInstance().isSignedIn.get();
  }
  /**
   *  Sign out the user upon button click.
   */
  gmailSignout() {
    return gapi.auth2.getAuthInstance().signOut();
  }

  createEventInGmail() {
    const listening = gapi.auth2.getAuthInstance().isSignedIn.listen();
    console.log('is logged in', this.isGmailSignedIn(), 'listening', listening);
    if (this.isGmailSignedIn()) {
      const event = {
        summary: 'Google I/O 2020',
        location: 'Hyderabad',
        description: 'A chance to hear more about Google\'s developer products.',
        start: {
          dateTime: '2020-06-17T09:00:00-07:00',
          timeZone: 'Asia/Kolkata'
        },
        end: {
          dateTime: '2020-06-18T17:00:00-07:00',
          timeZone: 'Asia/Kolkata'
        },
        recurrence: [
          'RRULE:FREQ=DAILY;COUNT=2'
        ],
        attendees: [
          { email: 'sai.p23@gmail.com' },
          { email: 'sbrin@example.com' }
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 }
          ]
        }
      };
      const request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });

      request.execute(function (event) {
        console.log('Event created successful', event);
      });
    } else {
      this.gmailSignInDialog();
    }
  }
}
