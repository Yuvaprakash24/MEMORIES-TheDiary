/*
function _(id){
    return document.getElementById(id)
}

function gettextholder(){
    let text = document.getElementById('text').value
    const d= new Date()

    document.getElementById('textholder').innerHTML +=`<div class="card"><p style="color: rgb(63, 63, 63);">${text}</p>
    <small style="color: rgb(189, 189, 189);">${d.toLocaleTimeString()}, ${d.toLocaleDateString() }</small>
    </div>`
}
*/

const d= new Date()
const date=d.toLocaleDateString()
const time=d.toLocaleTimeString()
class Note {
    constructor(id, text, time, date) {
        this.text = text,
        this.id = id,
        this.time = time,
        this.date = date
    }
}
class UI {
    static refreshNotes() {
        document.querySelector('#textholder').innerHTML = '';
        const notes = Store.getNotes();
        let i = notes.length;
        while(i--) UI.addNoteToList(notes[i]);
        UI.updateId();
    }
    static addNoteToList(note) {

        const list = document.querySelector('#textholder');
        let card = document.createElement('div');
        card.classList = 'card';

        card.innerHTML = `<p style="color: rgb(63, 63, 63);">${note.text}</p>
        <i class="fa fa-trash symbol" noteid="${note.id}"></i>
        <small style="color: rgb(189, 189, 189);">${note.time},${note.date}</small>`;
        list.appendChild(card);
    }
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert adjust alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#note-form');
        container.insertBefore(div, form);
        // vannish in 3 sec
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }
    static clearFields() {
        document.querySelector('#text').value = '';
        UI.updateId();
    }
    static updateId() {
        document.querySelector('#noteid').value = (Store.getLastNote()==undefined)? 1: Store.getLastNote().id+1;
    }
}

class Store {
    static getNotes() {
        let notes;
        if(localStorage.getItem('notes') == null) {
            notes = [];
        }
        else {
            notes = JSON.parse(localStorage.getItem('notes'));
        }
        return notes;
    }
    static getNote(id) {
        return Store.getNotes().find(val => val.id == id);
    }
    static getLastNote() {
        let notes = Store.getNotes();
        return notes[notes.length-1];
    }
    static addNote(note) {
        if(Store.getNote(note.id) !== undefined)  {
            Store.removeNote(note.id); // first remove note if exists
        }
        const notes = Store.getNotes();
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
    }
    static removeNote(id) {
        const notes = Store.getNotes();
        notes.forEach((note, index) => {
            if(note.id == id) {
                notes.splice(index, 1)
            }
        });
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}
document.addEventListener('DOMContentLoaded', UI.refreshNotes());

document.querySelector('#note-form').addEventListener('submit', e => {
    e.preventDefault();
    const text = document.getElementById('text').value;
    const id = parseInt(document.querySelector('#noteid').value);

    if(text == '') {
        UI.showAlert("Please fill in all fields", 'danger');
    }
    else {
        // Instantiate note
        
        const note = new Note(id, text, time, date);
        
        // Add Note
        UI.addNoteToList(note); 
        Store.addNote(note);
        UI.showAlert("Note Added ", 'success');
        UI.clearFields();
        UI.refreshNotes();
    }

})
document.getElementById('textholder').addEventListener('click', e => {
    UI.refreshNotes(); // from UI
    if(e.target.classList.contains('fa-trash')) {
        Store.removeNote(e.target.getAttribute('noteid')); // from storage
        UI.showAlert("Note Removed ", 'danger');
        UI.refreshNotes();
    }
})