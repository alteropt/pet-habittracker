import {
	generateStreakObject,
	getCurrentDate,
	getHabitHtml,
	updateLocaleStorageHabitsList,
	updateLocaleStorageHabitsListWithHabit,
} from './utils.js'

export class HabitsList extends EventTarget {
	constructor(habitsList) {
		super()
		this.habitsList = habitsList
	}

	addHabit(habit) {
		this.habitsList.push(habit)
		updateLocaleStorageHabitsList(this.habitsList)

		this.dispatchEvent(
			new CustomEvent('change', {
				detail: this,
			})
		)
	}

	removeHabit(habit) {
		this.habitsList = this.habitsList.filter(el => el.id !== habit.id)
		updateLocaleStorageHabitsList(this.habitsList)

		this.dispatchEvent(
			new CustomEvent('change', {
				detail: this,
			})
		)
	}
}

export class Habit {
	constructor(data, progressTracker, dateStarted, id, isNowCreated = true) {
		this.data = data
		this.habitNode = getHabitHtml(data)

		if (!isNowCreated) {
			this.dateStarted = dateStarted
			this.progressTracker = progressTracker
			this.id = id
		} else {
			this.dateStarted = getCurrentDate()
			this.progressTracker = generateStreakObject(
				this.dateStarted,
				data.goalInDays
			)
			this.id = Date.now()
		}
	}

	getProgress() {
		let counter = 0
		let maximum = 0
		for (let i in this.progressTracker) {
			if (this.progressTracker[i]) {
				counter += 1
			} else {
				counter = 0
			}
			if (counter > maximum) {
				maximum = counter
			}
		}

		counter = maximum

		return [counter, (counter / Object.keys(this.progressTracker).length) * 100]
	}

	toggleHabitDateToday() {
		const currentDate = getCurrentDate()
		if (this.progressTracker[currentDate] !== undefined) {
			this.progressTracker[currentDate] = !this.progressTracker[currentDate]
		}

		updateLocaleStorageHabitsListWithHabit(this)
	}
}
