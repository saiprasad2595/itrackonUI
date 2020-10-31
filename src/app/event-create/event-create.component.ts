import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EventService } from '../event.service';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ICreateEvent } from '../app.model';

moment().format();
@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent implements OnInit {

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  submitted = false;
  createEventForm = this.fb.group({
    title: ['', Validators.required],
    speaker: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    hangoutLink: ['', Validators.required],
    description: [''],
    fromDate: ['', Validators.required],
    fromTime: ['', Validators.required],
    toDate: ['', Validators.required],
    toTime: ['', Validators.required]
  });
  constructor(private fb: FormBuilder,
    private calendar: NgbCalendar,
    private eventService: EventService) { }

  ngOnInit() {
  }
  get form() { return this.createEventForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.createEventForm.invalid) {
      return;
    }
    const fromDateObj = this.createEventForm.value.fromDate;
    const fromTimeObj = this.createEventForm.value.fromTime;
    const fromFormatDate = this.convertToDateFormat({
      ...fromDateObj,
      ...fromTimeObj
    });

    const toDateObj = this.createEventForm.value.toDate;
    const toTimeObj = this.createEventForm.value.toTime;
    const toFormatDate = this.convertToDateFormat({
      ...toDateObj,
      ...toTimeObj
    });
    console.log('fromFormatDate', fromFormatDate,
      'toFormatDate', toFormatDate, 'form val', this.createEventForm.value);

    const formObj = this.createEventForm.value;
    const reqData: ICreateEvent = {
      start: fromFormatDate,
      end: toFormatDate,
      description: formObj.description,
      hangoutLink: formObj.hangoutLink,
      organizerEmail: formObj.email,
      title: formObj.title,
      speaker: formObj.speaker
    };
    this.eventService.createEvent(reqData)
      .subscribe((res) => {
        this.createEventForm.reset();
      });
  }
  convertToDateFormat(dateTimeObj) {
    return moment(dateTimeObj).format();
  }

}
