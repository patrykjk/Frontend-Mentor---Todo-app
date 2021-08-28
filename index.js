let todoInput = document.querySelector('#todo-input')
let todosContainer = document.querySelector('.todos-container')
let todosCountDiv = document.querySelector('.items-left')
let selectAllButton = document.querySelector('.select-all')
let NoTodosPlaceholder = document.querySelector('.no-todos-placeholder')
let filterButtonsDiv = document.querySelector('.filter-buttons-container')
let appliedFilter = 'all'
let todosArray = []



let saveAndDisplayTodo = userInput => {
    if (!userInput) return

    let id = Date.now()

    let todo = {
        text: userInput,
        id: id,
        completed: false
    }

    todosArray.push(todo)


    let div = document.createElement('div')
    div.draggable = true
    div.setAttribute('data-id', id)
    div.classList.add('todo')
    if (appliedFilter == 'completed') div.classList.add('hidden')

    let checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.classList.add('circle', 'todo-checkbox')

    let p = document.createElement('p')
    p.innerText = userInput

    let deleteButton = document.createElement('button')
    deleteButton.classList.add('todo-delete')

    let deleteButtonIcon = document.createElement('img')
    deleteButtonIcon.src = 'images/icon-cross.svg'
    deleteButton.append(deleteButtonIcon)

    div.append(checkbox, p, deleteButton)

    todosContainer.append(div)

    todoInput.value = ''
    selectAllButton.checked = false
    updateTodosCount()
    updateNoTodosPlaceholder()
}

let deleteTodo = todoDiv => {
    todosArray = todosArray.filter(todo => todo.id != todoDiv.dataset.id)
    todoDiv.remove()

    updateTodosCount()
    updateNoTodosPlaceholder()
}

let clearCompletedTodos = () => {
    let completedTodoIds = todosArray.map(todo => {
        if (todo.completed == true) return todo.id
    })

    completedTodoIds.forEach(id => {
        if (id) todosContainer.querySelector(`[data-id='${id}']`).remove()
    })

    todosArray = todosArray.filter(todo => todo.completed == false)

    updateTodosCount()
    updateNoTodosPlaceholder()
}

let toggleCompletedState = todoDiv => {
    let selectedTodo = todosArray.find(todo => todo.id == todoDiv.dataset.id)

    if (selectedTodo.completed) {
        selectedTodo.completed = false
        todoDiv.classList.remove('completed')
        todoDiv.querySelector('.todo-checkbox').checked = false
    } else {
        selectedTodo.completed = true
        todoDiv.classList.add('completed')
        todoDiv.querySelector('.todo-checkbox').checked = true
    }

    selectAllButton.checked = false
    filterTodos(filterButtonsDiv.querySelector('.selected').dataset.filter)
    updateNoTodosPlaceholder()
}

let handleSelectAllButtonClick = e => {
    // if (!todosContainer.querySelector('.todo')) return

    let activeTodos = todosContainer.querySelectorAll('.todo:not(.completed)')

    if (activeTodos.length) {
        activeTodos.forEach(todo => toggleCompletedState(todo))
        e.target.checked = true
    } else {
        todosContainer.querySelectorAll('.todo').forEach(todo => toggleCompletedState(todo))
    }

    updateNoTodosPlaceholder()
}

let filterTodos = filter => {
    let completedTodos = todosContainer.querySelectorAll('.completed')
    let activeTodos = todosContainer.querySelectorAll('.todo:not(.completed)')

    if (filter == 'completed') {
        completedTodos.forEach(todo => todo.classList.remove('hidden'))
        activeTodos.forEach(todo => todo.classList.add('hidden'))
    }

    if (filter == 'active') {
        completedTodos.forEach(todo => todo.classList.add('hidden'))
        activeTodos.forEach(todo => todo.classList.remove('hidden'))
    }

    if (filter == 'all') {
        activeTodos.forEach(todo => todo.classList.remove('hidden'))
        completedTodos.forEach(todo => todo.classList.remove('hidden'))
    }

    updateTodosCount()
    updateNoTodosPlaceholder()
}

let updateTodosCount = () => {
    let activeTodosCount = todosArray.filter(todo => todo.completed == false).length

    if (!activeTodosCount) todosCountDiv.innerText = 'No todos'
    if (activeTodosCount == 1) todosCountDiv.innerText = 'One item left'
    if (activeTodosCount > 1) todosCountDiv.innerText = `${activeTodosCount} items left`
}

let updateNoTodosPlaceholder = () => {
    let anyTodo = todosContainer.querySelector('.todo:not(.hidden)')

    if (!anyTodo) {
        let message
        if (appliedFilter == 'all') message = 'You have <br> nothing to do!'
        if (appliedFilter == 'active') message = "No Active Todos"
        if (appliedFilter == 'completed') message = 'No Completed Todos'

        NoTodosPlaceholder.innerHTML = message
        NoTodosPlaceholder.classList.remove('hidden')
    } else {
        NoTodosPlaceholder.classList.add('hidden')
    }
}

let toggleDarkTheme = () => {
    document.body.classList.toggle('dark-theme')
}




// todoInput.addEventListener('keydown', e => {
//     if (e.key != 'Enter') return

//     saveAndDisplayTodo(todoInput.value.trim())

//     todoInput.value = ''
// })

document.addEventListener('keydown', e => {
    if (e.key != 'Enter') return

    if (e.target.matches('#todo-input')) saveAndDisplayTodo(e.target.value.trim())

    if (e.target.matches('.select-all')) handleSelectAllButtonClick(e)

    if (e.target.matches('.todo-checkbox')) {
        toggleCompletedState(e.target.closest('.todo'))
        updateTodosCount()
    }
})

document.addEventListener('click', e => {

    if (e.target.matches('.todo-delete')) {
        deleteTodo(e.target.closest('.todo'))
        updateTodosCount()
    }

    if (e.target.matches('.todo-checkbox') || e.target.matches('.todo p')) {
        toggleCompletedState(e.target.closest('.todo'))
        updateTodosCount()
    }

    if (e.target.matches('.select-all')) handleSelectAllButtonClick(e)

    if (e.target.matches('.filter-buttons-container button')) {
        appliedFilter = e.target.dataset.filter
        filterTodos(appliedFilter)
        filterButtonsDiv.querySelector('.selected').classList.remove('selected')
        e.target.classList.add('selected')
    }

    if (e.target.matches('.clear-completed')) clearCompletedTodos()

    if (e.target.matches('.dark-theme-toggle')) toggleDarkTheme()
})

let draggingTodo

let handleDragstart = e => {
    e.dataTransfer.setData("text/html", e.target.outerHTML)
    e.dataTransfer.effectAllowed = "move"
    draggingTodo = e.target
}
let handleDragover = e => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    todosContainer.style.setProperty('--display', 'block')

    let currentDragPosition
    try {
        currentDragPosition = e.target.closest('.todo')
    } catch { }
    if (currentDragPosition) {
        let cursorPosition = e.pageY - todosContainer.offsetTop
        let todoHeight = currentDragPosition.getBoundingClientRect().height

        if (cursorPosition % todoHeight < todoHeight / 2) {
            todosContainer.style.setProperty('--position', cursorPosition - (cursorPosition % todoHeight) + 'px')
        } else {
            todosContainer.style.setProperty('--position', cursorPosition - (cursorPosition % todoHeight) + todoHeight + 'px')
        }
    }
}
let handleDrop = e => {
    e.preventDefault()
    let dropPosition = e.target.closest('.todo')
    todosContainer.style.setProperty('--display', 'none')

    if (dropPosition) {
        if (e.pageY - todosContainer.offsetTop - e.target.closest('.todo').offsetTop < e.target.closest('.todo').getBoundingClientRect().height / 2) {
            todosContainer.insertBefore(draggingTodo, dropPosition)
        } else {
            todosContainer.insertBefore(draggingTodo, dropPosition.nextSibling)

        }
    } else if (e.target === todosContainer) {
        todosContainer.append(draggingTodo)
    }
}

let handleDragleave = () => {
    todosContainer.style.setProperty('--display', 'none')
}


todosContainer.addEventListener('dragstart', e => {
    if (e.target.matches('.todo')) handleDragstart(e)
})

todosContainer.addEventListener('drop', e => handleDrop(e))

todosContainer.addEventListener('dragover', e => handleDragover(e))

todosContainer.addEventListener('dragleave', () => handleDragleave())





updateTodosCount()
updateNoTodosPlaceholder()