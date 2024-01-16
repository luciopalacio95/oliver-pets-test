const moment = require('moment')
const fs = require('fs');

// nos enfocamos en obtener las plazas que realmente estan disponibles
class Spot {
	//obtenemos el listado de array completo
	getFullArray(calendarFile) {
		let rawdata = fs.readFileSync('./calendars/calendar.' + calendarFile + '.json');
		let fullArray = JSON.parse(rawdata);
		return fullArray;
	}

	//reducimos y obtenemos el array de slot con una determinada fecha
	getSlot(slots, date) {
		let daySlot = []
		for (const key in slots) {
			if (key === date) {
				daySlot = slots[key]
			}
		}
		return daySlot;
	}

	//reducimos y obtenemos el array de session con una determinada fecha
	getSession(sessions, date) {
		let daySession = []
		for (const key in sessions) {
			if (key === date) {
				daySession = sessions[key]
			}
		}
		return daySession;
	}

	//obtenemos los slots realmente disponibles
	getRealSlot(slot, sessions) {
		const realSlots = [];
		slot.forEach(daySlot => {
			if (sessions) {
				let noConflicts = true;
				sessions.forEach(sessionSlot => {
					let sessionStart = sessionSlot.start;
					let sessionEnd = sessionSlot.end;
					let start = daySlot.start;
					let end = daySlot.end;
					if (sessionStart > start && sessionEnd < end) {
						realSlots.push({ start: daySlot.start, end: sessionSlot.start});
						realSlots.push({ start: sessionSlot.end, end: daySlot.end});
						noConflicts = false;
					} else if (sessionStart === start && sessionEnd < end) {
						realSlots.push({ start: sessionSlot.end, end: daySlot.end});
						noConflicts = false;
					} else if (sessionStart > start && sessionEnd === end) {
						realSlots.push({ start: daySlot.start, end: sessionSlot.start});
						noConflicts = false;
					} else if (sessionStart === start && sessionEnd === end) {
						noConflicts = false;
					}
				})
				if (noConflicts) {
					realSlots.push(daySlot);
				}
			} else {
				realSlots.push(daySlot);
			}
		})
		return realSlots;
	}

}

// nos enfocamos en obtener los tiempos de duracion de las sessiones 
class SessionTime{

	//añadimos la hora y minuto a la fecha y seteamos formato date
	getDateTime = (hour, dateISO) => {
		let finalHourForAdd = moment(dateISO + ' ' + hour);
		return finalHourForAdd;
	}

	//añadimos los minutos de full duracion a las fechas
	addMinutes(hour, minutes) {
		let result = moment(hour).add(minutes, 'minutes').format('HH:mm');
		return result;
	}

	getOneMiniSlot(date, duration, durationBefore, durationAfter, startSlot, endSlot) {
		const self = this; // Almacenar la referencia de contexto actual
		const dateISO = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
		let startHourFirst = self.getDateTime(startSlot, dateISO);
		let startHour = startHourFirst.format('HH:mm');;
		let endHour = self.addMinutes(startHourFirst, durationBefore + duration + durationAfter);
		let clientStartHour = self.addMinutes(startHourFirst, durationBefore);
		let clientEndHour = self.addMinutes(startHourFirst, duration);
		if (moment.utc(endHour, 'HH:mm').valueOf() > moment.utc(endSlot, 'HH:mm').valueOf()) {
			return null;
		} 
		const objSlot = {
			startHour: moment.utc(dateISO + ' ' + startHour)
			.toDate(),
			endHour: moment.utc(dateISO + ' ' + endHour)
			.toDate(),
			clientStartHour: moment.utc(dateISO + ' ' + clientStartHour)
			.toDate(),
			clientEndHour: moment.utc(dateISO + ' ' + clientEndHour)
			.toDate(),
		};
		return objSlot;
	}
	
	//calculamos los tiempos de la session y lo que realmente demora el cliente
	calculateTime(durationBefore, durationAfter, duration, date, realSlots){
		let arrSlot = [];
		const self = this; // Almacenar la referencia de contexto actual
		realSlots.forEach(function (slot) {
			let start = slot.start;
			let resultSlot;
			do {
			resultSlot = self.getOneMiniSlot(date, duration, durationBefore, durationAfter,start, slot.end);
			if (resultSlot) {
				arrSlot.push(resultSlot);
				start = moment.utc(resultSlot.endHour).format('HH:mm');
			}
			} while (resultSlot);

			return arrSlot;
		});
		return arrSlot;
	}
}

module.exports = {Spot,SessionTime};