// Modal
export function closeModal(modal) {
	const body = document.querySelector('body')

	modal.classList.remove('active')
	body.classList.remove('modal-opened')
}

export function modalHandler(
	modal,
	modalContent,
	modalTriggers,
	modalCloseTrigger
) {
	const body = document.querySelector('body')

	modalTriggers.forEach(modalTrigger => {
		modalTrigger.addEventListener('click', function () {
			modal.classList.add('active')
			body.classList.add('modal-opened')
		})
	})

	modalCloseTrigger.addEventListener('click', function () {
		closeModal(modal)
	})

	modal.addEventListener('click', function () {
		closeModal(modal)
	})

	modalContent.addEventListener('click', function (event) {
		event.stopPropagation()
	})
}

// LocalStorage Handling
export function updateLocaleStorageHabitsList(habitsList) {
	localStorage.setItem('habits', JSON.stringify(habitsList))
}

export function updateLocaleStorageHabitsListWithHabit(habit) {
	const habitsList = JSON.parse(localStorage.getItem('habits')).map(el => {
		if (el.id !== habit.id) {
			return el
		} else {
			return habit
		}
	})

	localStorage.setItem('habits', JSON.stringify(habitsList))
}

// Helpful utils
export function getCurrentDate() {
	const today = new Date()
	const year = today.getFullYear()
	const month = String(today.getMonth() + 1).padStart(2, '0')
	const day = String(today.getDate()).padStart(2, '0')
	const formattedDate = `${year}-${month}-${day}`

	return formattedDate
}

export function generateStreakObject(startDate, daysCount) {
	const result = {}
	const date = new Date(startDate)

	for (let i = 0; i < daysCount; i++) {
		const key = date.toISOString().split('T')[0]
		result[key] = false
		date.setDate(date.getDate() + 1)
	}

	return result
}

function progressFailed(progressTracker) {
	const currentDate = getCurrentDate()

	if (progressTracker === undefined) {
		for (let i of progressTracker) {
			if (!i) {
				return true
			}
		}
	} else {
		for (let i in progressTracker) {
			if (i === currentDate) {
				break
			}
			if (!progressTracker[i]) {
				return true
			}
		}
	}

	return false
}

// Habit Handling
export function getHabitHtml({ title, goalInDays }) {
	return `
		<div class="habits__content">
			<h4 class="habits__title">${title}</h4>
			<p class="habits__goal">
				<span class="habits__streak"></span> / ${goalInDays} ${
		goalInDays === 1 ? 'day' : 'days'
	}
			</p>
			<span class="habits__failed-span">Failed</span>
		</div>
		<div class="habits__progress">
			<input type="checkbox" />
			<div>
				Progress:
				<div class="habits__progressbar"><span></span></div>
			</div>
		</div>
		<div class="habits__isdonetoday"></div>
		<button class="habits__delete btn">Delete</button>
	`
}

function handleProgress(habitNode, habit) {
	const currentDate = getCurrentDate()
	const habitStreak = habitNode.querySelector('.habits__streak')
	habitStreak.innerHTML = habit.getProgress()[0]
	const habitProgressbar = habitNode.querySelector('.habits__progressbar span')
	habitProgressbar.style.width = `${habit.getProgress()[1]}%`

	habitNode.classList.remove('done')
	habitNode.classList.remove('failed')
	if (habit.getProgress()[1] === 100) {
		habitNode.classList.add('done')

		if (habit.progressTracker[currentDate] === undefined) {
			habitNode.classList.add('done-earlier')
		}
	}
	if (progressFailed(habit.progressTracker)) {
		habitNode.classList.add('failed')
	}
}

function handleDelete(habitNode, habitsListInstance, habit) {
	const deleteHabitButton = habitNode.querySelector('.habits__delete')
	deleteHabitButton.addEventListener('click', function () {
		habitsListInstance.removeHabit(habit)
	})
}

function handleToggleDateToday(habitNode, habit) {
	const habitCheckbox = habitNode.querySelector('.habits__progress input')
	const currentDate = getCurrentDate()

	habitCheckbox.checked = habit.progressTracker[currentDate]
	habitCheckbox.addEventListener('change', () => {
		habit.toggleHabitDateToday()
		handleProgress(habitNode, habit)
	})
}

export function renderHabits(habitsListInstance) {
	const habitsContainer = document.querySelector('.habits__inner')
	habitsContainer.innerHTML = ''

	if (!habitsListInstance.habitsList.length) {
		habitsContainer.innerHTML =
			'<h2 class="habits__nohabits">You have no habit yet</h2>'
		return
	}

	habitsListInstance.habitsList.forEach(habit => {
		const habitNode = document.createElement('div')
		habitNode.classList.add('habits__habit')

		habitNode.innerHTML = getHabitHtml(habit.data)

		handleProgress(habitNode, habit)
		handleDelete(habitNode, habitsListInstance, habit)
		handleToggleDateToday(habitNode, habit)

		habitsContainer.append(habitNode)
	})
}
