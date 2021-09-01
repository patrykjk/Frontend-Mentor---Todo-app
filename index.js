let todoInput = document.querySelector('#todo-input')
let todosContainer = document.querySelector('.todos-container')
let todosCountDiv = document.querySelector('.items-left')
let selectAllButton = document.querySelector('.select-all')
let noTodosPlaceholder = document.querySelector('.no-todos-placeholder')
let filterButtonsDiv = document.querySelector('.filter-buttons-container')
let appliedFilter = 'all'
let draggingTodo

let todosArray = [
    {
        text: 'Read for 1 hour',
        id: 1,
        completed: true
    },
    {
        text: 'Pick up groceries',
        id: 2,
        completed: false
    },
    {
        text: 'Complete Todo App on Frontend Mentor',
        id: 3,
        completed: false
    },
]






// ===============

// FUNCTIONS

// ===============


let saveTodo = (text, id) => {
    let todo = {
        text,
        id,
        completed: false
    }
    todosArray.push(todo)
}


let displayTodo = (text, id, completed) => {
    let div = document.createElement('div')
    div.draggable = true
    div.setAttribute('data-id', id)
    div.classList.add('todo')
    if (appliedFilter == 'completed') div.classList.add('hidden')

    let checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.classList.add('circle', 'todo-checkbox')

    let p = document.createElement('p')
    p.innerText = text

    let deleteButton = document.createElement('button')
    deleteButton.classList.add('todo-delete')

    let deleteButtonIcon = document.createElement('img')
    deleteButtonIcon.src = 'images/icon-cross.svg'
    deleteButton.append(deleteButtonIcon)

    if (completed) {
        div.classList.add('completed')
        checkbox.checked = true
    }

    div.append(checkbox, p, deleteButton)

    let visibleTodosArray = todosContainer.querySelectorAll('.todo:not(.hidden)')
    let lastTodo = visibleTodosArray[visibleTodosArray.length - 1]

    if (lastTodo) {
        let lastTodoOffset = parseInt(lastTodo.style.top)
        let lastTodoHeight = lastTodo.offsetHeight
        div.style.top = lastTodoOffset + lastTodoHeight + 'px'
    } else {
        div.style.top = 0
    }

    todosContainer.append(div)
}


let deleteTodo = todoDiv => {
    todosArray = todosArray.filter(todo => todo.id != todoDiv.dataset.id)
    todoDiv.remove()
}


let clearCompletedTodos = () => {
    let completedTodoIds = todosArray.map(todo => {
        if (todo.completed) return todo.id
    })

    completedTodoIds.forEach(id => {
        if (id) todosContainer.querySelector(`[data-id='${id}']`).remove()
    })

    todosArray = todosArray.filter(todo => todo.completed == false)
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
        completedTodos.forEach(todo => todo.classList.remove('hidden'))
        activeTodos.forEach(todo => todo.classList.remove('hidden'))
    }
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

        noTodosPlaceholder.innerHTML = message
        noTodosPlaceholder.classList.remove('hidden')
    } else {
        noTodosPlaceholder.classList.add('hidden')
    }
}


let appendDraggedDiv = e => {
    let dropPosition = e.target.closest('.todo')
    let currentDraggingTodoOffset = getComputedStyle(draggingTodo).top

    if (draggingTodo.offsetTop < dropPosition.offsetTop) {
        todosContainer.insertBefore(draggingTodo, dropPosition.nextSibling)
    } else {
        todosContainer.insertBefore(draggingTodo, dropPosition)
    }

    draggingTodo.style.top = currentDraggingTodoOffset
}


let updateTodosPosition = () => {
    let todos = todosContainer.querySelectorAll('.todo:not(.hidden)')
    let prevTodo

    todos.forEach(todo => {
        if (prevTodo) {
            let prevTodoOffset = parseInt(prevTodo.style.top)
            let prevTodoHeight = prevTodo.offsetHeight

            todo.style.top = prevTodoOffset + prevTodoHeight + 'px'

            prevTodo = todo

        } else {
            let xd1 = noTodosPlaceholder.offsetTop
            // without the above line there is no transition when dragging a todo to the very top
            todo.style.top = 0

            prevTodo = todo
        }
    })
}


let updateContainerHeight = () => {
    let todos = todosContainer.querySelectorAll('.todo:not(.hidden)')
    let height = 0

    todos.forEach(todo => height += todo.offsetHeight)
    todosContainer.style.height = height + 'px'
}


let toggleTransition = () => {
    todosContainer.querySelectorAll('.todo').forEach(todo => {
        todo.style.transition = 'unset'
        setTimeout(() => todo.style.removeProperty('transition'), 24)
    })
}










// ======================

// EVENT HANDLERS

// ======================


let handleTodoInputSubmit = e => {
    let text = e.target.value.trim()
    if (!text) return
    let id = Date.now()

    saveTodo(text, id)
    displayTodo(text, id)
    updateContainerHeight()
    updateTodosCount()
    updateNoTodosPlaceholder()

    e.target.value = ''
    selectAllButton.checked = false
}


let handleDeleteButtonClick = e => {
    deleteTodo(e.target.closest('.todo'))
    updateTodosPosition()
    updateContainerHeight()
    updateTodosCount()
    updateNoTodosPlaceholder()
}


let handleClearCompletedButtonClick = () => {
    clearCompletedTodos()
    updateTodosPosition()
    updateContainerHeight()
    updateTodosCount()
    updateNoTodosPlaceholder()
}


let handleTodoCheckboxClick = e => {
    toggleCompletedState(e.target.closest('.todo'))
    filterTodos(filterButtonsDiv.querySelector('.selected').dataset.filter)
    updateTodosPosition()
    updateContainerHeight()
    updateTodosCount()
    updateNoTodosPlaceholder()
    selectAllButton.checked = false
}


let handleSelectAllButtonClick = e => {
    let activeTodos = todosContainer.querySelectorAll('.todo:not(.completed)')

    if (activeTodos.length) {
        activeTodos.forEach(todo => toggleCompletedState(todo))
        e.target.checked = true
    } else {
        todosContainer.querySelectorAll('.todo').forEach(todo => toggleCompletedState(todo))
    }

    filterTodos(appliedFilter)
    updateTodosPosition()
    updateContainerHeight()
    updateTodosCount()
    updateNoTodosPlaceholder()
}


let handleFilterButtonClick = e => {
    appliedFilter = e.target.dataset.filter
    filterTodos(appliedFilter)
    toggleTransition()
    updateTodosPosition()
    updateContainerHeight()
    updateNoTodosPlaceholder()

    filterButtonsDiv.querySelector('.selected').classList.remove('selected')
    e.target.classList.add('selected')
}


let handleDarkThemeButtonClick = () => {
    document.body.classList.toggle('dark-theme')
}


let handleDragstart = e => {
    if (draggingTodo) draggingTodo.style.removeProperty('z-index')
    draggingTodo = e.target.closest('.todo')
    draggingTodo.style.zIndex = 1
}


let handleDragover = e => {
    let target = e.target.closest('.todo')
    if (!target || target.classList.contains('moving') || target == draggingTodo) return

    appendDraggedDiv(e)
    updateTodosPosition()

    target.classList.add('moving')
    setTimeout(() => target.classList.remove('moving'), 321)
}










// ========================

// EVENT LISTENERS

// ========================


document.addEventListener('click', e => {
    if (e.target.matches('.todo-delete')) handleDeleteButtonClick(e)

    if (e.target.matches('.clear-completed')) handleClearCompletedButtonClick()

    if (e.target.matches('.todo-checkbox') ||
        e.target.matches('.todo p')) handleTodoCheckboxClick(e)

    if (e.target.matches('.select-all')) handleSelectAllButtonClick(e)

    if (e.target.matches('.filter-buttons-container button')) handleFilterButtonClick(e)

    if (e.target.matches('.dark-theme-toggle')) handleDarkThemeButtonClick()
})


document.addEventListener('keydown', e => {
    if (e.key != 'Enter') return

    if (e.target.matches('#todo-input')) handleTodoInputSubmit(e)

    if (e.target.matches('.select-all')) handleSelectAllButtonClick(e)

    if (e.target.matches('.todo-checkbox')) handleTodoCheckboxClick(e)
})


todosContainer.addEventListener('dragstart', e => handleDragstart(e))

todosContainer.addEventListener('dragover', e => handleDragover(e))







// =======================

// INITIAL RENDER

// =======================


todosArray.forEach(todo => displayTodo(todo.text, todo.id, todo.completed))
updateTodosPosition()
updateContainerHeight()
updateTodosCount()
updateNoTodosPlaceholder()