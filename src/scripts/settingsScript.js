'use-strict'

const Store = require('electron-store')

const store = new Store()

const defaultFlag = 'US'

// FLAGS
if(!(store.has('source_flag'))) {
    store.set('source_flag', `${defaultFlag}`)
    document.querySelector(`input[value="${defaultFlag}"]`).checked = true
} else {
    document.querySelector(`input[value="${store.get('source_flag')}"]`).checked = true
}

var sourceFlagRadios = document.querySelectorAll('input[name="flag"]')

Object.keys(sourceFlagRadios).forEach(radio => {
    Object.values(sourceFlagRadios)[radio].addEventListener('click', (event) => {
        store.set('source_flag', document.querySelector('input[name="flag"]:checked').value) // US, IT...
    })
})

// CHECKBOXES

// update-progress
if(!(store.has('update_progress'))) {
    store.set('update_progress', false)
}

var updateProgressCheckbox = document.getElementById('update-progress-checkbox')

store.get('update_progress') == true
    ? updateProgressCheckbox.checked = true
    : updateProgressCheckbox.checked = false

updateProgressCheckbox.addEventListener('click', (event) => {
    updateProgressCheckbox.checked == true
        ? store.set('update_progress', true)
        : store.set('update_progress', false)
})

// dubbed
if(!(store.has('dubbed'))) {
    store.set('dubbed', false)
}

var dubbedCheckbox = document.getElementById('dubbed-checkbox')

store.get('dubbed') == true
    ? dubbedCheckbox.checked = true
    : dubbedCheckbox.checked = false

dubbedCheckbox.addEventListener('click', (event) => {
    dubbedCheckbox.checked == true
        ? store.set('dubbed', true)
        : store.set('dubbed', false)
})
