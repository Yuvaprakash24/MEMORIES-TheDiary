const d= new Date()
const date = d.toLocaleDateString()
const time = d.toLocaleTimeString()
const yyyy = d.getFullYear();
let mm = d.getMonth() + 1;
let dd = d.getDate();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

const formattedDate = dd + '-' + mm + '-' + yyyy;
function adddate() {
    return `                                                                                                            Date: ${formattedDate}\r`
}
document.getElementById('text').innerHTML= adddate();

class Diary{
    constructor(id,text,date,time,formattedDate){
        this.text = text,
        this.id = id,
        this.date = date,
        this.time = time,
        this.formattedDate = formattedDate
    }
}

class UV {
    static refreshMyDiary(){
        document.querySelector('#MyDiary').innerHTML ='';
        const mydiary = Storeit.getMyDiary();
        let i = mydiary.length;
        while(i--) UV.addDiaryToList(mydiary[i]);
        UV.updateId();
    }
    static addDiaryToList(diary) {
        const list= document.querySelector('#MyDiary');
        let card= document.createElement('div');
        card.classList = 'card mb-3';
        card.style = "float:right;";

        card.innerHTML = `
        <div class="card-header">
                <span>Date: ${diary.formattedDate}</span>
                <i class="fa fa-trash" diaryid="${diary.id}"></i>
                <i class="fa fa-envelope-open-text px-3" diaryid="${diary.id}"></i>
            </div>
        <p class="edit" style="display:none;">${diary.text}</p>
        <small style="color: rgb(189, 189, 189); text-align: right;">Created on:${diary.time},${diary.date}</small>`;
        list.appendChild(card);
    }
    static clearFields() {
        document.querySelector('#text').value = '';
        UV.updateId();
    }
    static updateId() {
        document.querySelector('#diaryid').value = (Storeit.getlastDiary()==undefined)? 1: Storeit.getlastDiary().id+1;
    }
}

class Storeit {
    static getMyDiary(){
        let mydiary;
        if(localStorage.getItem('mydiary') == null){
            mydiary = [];
        }
        else {
            mydiary = JSON.parse(localStorage.getItem('mydiary'));
        }
        return mydiary;
    }
    static getDiary(id) {
        return Storeit.getMyDiary().find(val => val.id == id);
    }
    static getlastDiary() {
        let mydiary = Storeit.getMyDiary();
        return mydiary[mydiary.length-1];
    }
    static addDiary(diary) {
        if(Storeit.getDiary(diary.id) !== undefined)  {
            Storeit.RemoveDiary(diary.id); // first remove diary if exists
        }
        const mydiary= Storeit.getMyDiary();
        mydiary.push(diary);
        localStorage.setItem('mydiary', JSON.stringify(mydiary));
    }
    static RemoveDiary(id) {
        const mydiary= Storeit.getMyDiary();
        mydiary.forEach((diary, index) => {
            if(diary.id == id) {
                mydiary.splice(index, 1)
            }
        });
        localStorage.setItem('mydiary', JSON.stringify(mydiary));
    }
}


document.addEventListener('DOMContentLoaded', UV.refreshMyDiary());

document.querySelector('#diary-form').addEventListener('submit', e => {
    e.preventDefault();
    const text = document.getElementById('text').value;
    const id = parseInt(document.querySelector('#diaryid').value);
        
        const diary = new Diary(id, text, date, time, formattedDate);
        
        UV.addDiaryToList(diary); 
        Storeit.addDiary(diary);
        UV.clearFields();
        UV.refreshMyDiary();
    

})

document.getElementById('MyDiary').addEventListener('click', e => {
    UV.refreshMyDiary(); // from UI
    if(e.target.classList.contains('fa-trash')) {
        Storeit.RemoveDiary(e.target.getAttribute('diaryid')); // from storage
        UV.refreshMyDiary();
    }
    if(e.target.classList.contains('fa-envelope-open-text')) {
        document.querySelector('#text').value = e.target.parentElement.parentElement.querySelector('.edit').innerText.trim();
        document.querySelector('#diaryid').value = e.target.getAttribute('diaryid');
        
    }
})