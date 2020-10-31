import { Component, OnInit } from '@angular/core';

declare var gapi: any;
@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss']
})
export class EventViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  gmailSignInDialog() {
    gapi.auth2.getAuthInstance().signIn();
  }
  isGmailSignedIn(): boolean {
    return gapi.auth2.getAuthInstance().isSignedIn.get();
  }
  addToCalendar() {
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
