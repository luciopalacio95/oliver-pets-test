const moment = require('moment')
const Calendar = require('./Calendar')
const assert = require('assert')

describe('show sport Available', function () {
	it('Should get 1 available spots of calendar 1', function () {
		const defaultDate = "10-04-2023";
		const defaultDuration = 30;
		const slots = new Calendar.Spot();
		const sessionTime = new Calendar.SessionTime();
		let fullArray = slots.getFullArray(1);
		let slot = slots.getSlot(fullArray.slots, defaultDate);
		let session = slots.getSession(fullArray.sessions, defaultDate);
		let realSlot = slots.getRealSlot(slot, session);
		let result = sessionTime.calculateTime(fullArray.durationBefore, fullArray.durationAfter, defaultDuration, defaultDate, realSlot);
		console.log(result);
		assert.ok(result);
		assert.equal(result.length, 1);
		assert.equal(result[0].startHour.valueOf(), moment.utc('2023-04-10T16:00:00.000Z').valueOf());
		assert.equal(result[0].endHour.valueOf(), moment.utc('2023-04-10T16:50:00.000Z').valueOf());
	})
})

describe('show sport Available', function () {
	it('Should get 1 available spots of calendar 2', function () {
		const defaultDate = "13-04-2023";
		const defaultDuration = 25;
		const slots = new Calendar.Spot();
		const sessionTime = new Calendar.SessionTime();
		let fullArray = slots.getFullArray(2);
		let slot = slots.getSlot(fullArray.slots, defaultDate);
		let session = slots.getSession(fullArray.sessions, defaultDate);
		let realSlot = slots.getRealSlot(slot, session);
		let result = sessionTime.calculateTime(fullArray.durationBefore, fullArray.durationAfter, defaultDuration, defaultDate, realSlot);
		assert.ok(result);
		assert.equal(result.length, 1);
		assert.equal(result[0].startHour.valueOf(), moment.utc('2023-04-13T18:00:00.000Z').valueOf());
		assert.equal(result[0].endHour.valueOf(), moment.utc('2023-04-13T18:25:00.000Z').valueOf());
	})
})

describe('show sport Available', function () {
	it('Should get no available spots of calendar 3', function () {
		const defaultDate = "16-04-2023";
		const defaultDuration = 25;
		const slots = new Calendar.Spot();
		const sessionTime = new Calendar.SessionTime();
		//Fix, llamaba al calendar 2, no al 3.
		let fullArray = slots.getFullArray(3);
		let slot = slots.getSlot(fullArray.slots, defaultDate);
		let session = slots.getSession(fullArray.sessions, defaultDate);
		let realSlot = slots.getRealSlot(slot, session);
		let result = sessionTime.calculateTime(fullArray.durationBefore, fullArray.durationAfter, defaultDuration, defaultDate, realSlot);
		assert.ok(result);
		assert.equal(result.length, 0);
	})
})