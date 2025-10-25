import { Habit, HabitsList } from './classes.js'
import { closeModal, modalHandler, renderHabits } from './utils.js'

document.addEventListener('DOMContentLoaded', function () {
	const habitsList = new HabitsList([])
	if (localStorage.getItem('habits')) {
		JSON.parse(localStorage.getItem('habits')).forEach(habit => {
			const newHabit = new Habit(
				habit.data,
				habit.progressTracker,
				habit.dateStarted,
				habit.id,
				false
			)
			habitsList.addHabit(newHabit)
		})
	}
	renderHabits(habitsList)

	habitsList.addEventListener('change', function (e) {
		renderHabits(e.detail)
	})

	const habitCreateModal = document.querySelector('.modal')
	const habitCreateModalTriggers = document.querySelectorAll('.create-habit')
	const habitCreateModalClose = document.querySelector('.modal__close')
	const habitCreateModalContent = document.querySelector('.modal__content')
	const habitCreateForm = document.querySelector('.modal__form')

	modalHandler(
		habitCreateModal,
		habitCreateModalContent,
		habitCreateModalTriggers,
		habitCreateModalClose
	)

	habitCreateForm.addEventListener('submit', function (e) {
		e.preventDefault()

		const modalFormName = document.querySelector('.modal__form-name')
		const modalFormGoal = document.querySelector('.modal__form-goal')

		if (modalFormName.value.trim() && modalFormGoal.value.trim()) {
			const newHabit = new Habit({
				title: modalFormName.value,
				goalInDays: +modalFormGoal.value,
			})

			habitsList.addHabit(newHabit)

			modalFormName.value = ''
			modalFormGoal.value = ''
			closeModal(habitCreateModal)
		}
	})
})
