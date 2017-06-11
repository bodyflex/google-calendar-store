import * as moment from 'moment';
import CalendarEvent from './CalendarEvent';

export default class Day {
  date: moment.Moment;
  events: Array<CalendarEvent> = [];
  
  constructor(date: moment.Moment, events) {
    this.date = date.startOf('day');
    this.events = events;
  }

  toString() {
    return `${this.date.format()}: ${this.events.map(e => e.summary).join(', ')}`;
  }
};