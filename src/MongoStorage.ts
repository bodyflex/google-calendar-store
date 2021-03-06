import * as moment from 'moment';

import {MongoClient} from 'mongodb';
import {EventStorage} from './EventStorage';
import CalendarEvent from './CalendarEvent';

export default class MongoStorage implements EventStorage {
  db: any;
  collection: any;

  async init(url: string = process.env.MONGO_URL) {
    this.db = await MongoClient.connect(url);
    this.collection = this.db.collection('events');
  }

  create(event: CalendarEvent) {
    return this.collection.insertOne(event.data);
  }

  update(eventId: string, event: CalendarEvent) {
    return this.collection.updateOne(
      {googleId: eventId},
      event.data
    );
  }

  async findOne(eventId) {
    const event = await this.collection.findOne({googleId: eventId});
    if (event) {
      return new CalendarEvent(event);
    }
    return null;
  }

  async find(calendarId, start, end) {
    const query = {
      calendarGoogleId: calendarId,
      cancelled: false,
      start: {$gte: start, $lte: end}
    };
    if (!calendarId) {
      delete query.calendarGoogleId;
    }
    if (!start) {
      delete query.start.$gte;
    }
    if (!end) {
      delete query.start.$lte;
    }
    if (!start && !end) {
      delete query.start;
    }
    const items = await this.collection.find(query, {
      sort: [['start', 'asc']]
    }).toArray();
    return items.map(i => new CalendarEvent(i));
  }
}