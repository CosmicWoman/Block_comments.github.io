let jsonData = JSON.parse(data, function (key, value){
   if (key === 'date') {
       return new Date(value)
   } else if (key === 'data_counter') {
       let num = Number(value);
       let result = (num === 0) ? '' : num;
       return result;
   } else {
       return value;
   }
});

function createComments(){
    for (let review of jsonData.comments){
        createComment(review);
    }
}

function formSubmit(event) {
    console.log('formSubmit');
    event.preventDefault();
    let review = {
        name: document.querySelector('#input_name').value,
        text: document.querySelector('#input_text').value,
        date: document.querySelector('#input_date').value,
        is_like: false,
        data_counter: 0,
    };

    if (!review.date) {
        review.date = new Date();
    } else {
        review.date = new Date(review.date)
    }
    if (validateForm(review)){
        createComment(review);
        deleteForm(review);
    }
}

function createComment(review){
    let parent = document.querySelector('.comments_list');
    let firstChild = parent.firstChild;
    let comment = document.createElement('div');
    comment.classList.add('comment');

    let name = document.createElement('div');
    name.classList.add('comment_name');

    let text = document.createElement('div');
    text.classList.add('comment_text');

    let date = document.createElement('div');
    date.classList.add('comment_date');

    let buttons = document.createElement('div');
    buttons.classList.add('comment_button');

    let like = document.createElement('button');
    like.classList.add('comment_like');
    if(review.is_like){
        like.classList.add('comment_like_true')
    }
    let del = document.createElement('button');
    del.classList.add('comment_delete');

    parent.insertBefore(comment, firstChild);
    comment.appendChild(name);
    comment.appendChild(text);
    comment.appendChild(date);
    comment.appendChild(buttons);
    buttons.appendChild(like);
    buttons.appendChild(del);

    name.innerHTML = review.name;
    text.innerHTML = review.text;
    date.innerHTML = convertDate(review.date);
    like.textContent = review.data_counter || '';
    let num = review.data_counter;
    like.setAttribute('data-counter', num);

    set_event_on_click('.comment_delete', blockDelete);

    set_event_on_click('.comment_like', likeTrue);
}


function convertDate(date){
    let now = new Date();
    let today = now.toLocaleDateString();
    let day = new Date(Date.now() - 86400000);
    let yesterday = day.toLocaleDateString();
    let hours = date.toLocaleTimeString([],{hour:'2-digit', minute: '2-digit'});
    let reductionDate = date.toLocaleDateString();
    if (reductionDate === today) {
        return 'сегодня ' + hours;
    } else if (reductionDate === yesterday) {
        return 'вчера ' + hours;
    } else {
        return reductionDate;
    }
}

function blockDelete(){
    this.closest('.comment').outerHTML = '';
}

function likeTrue(e){
    let count = Number(this.dataset.counter);

    if(this.classList.contains('comment_like_true')){
        this.classList.remove('comment_like_true');
        count -= 1;
    } else {
        count += 1;
        this.classList.add('comment_like_true');
    }
    this.dataset.counter = count;
    this.textContent = count || '';
}

function enter(event){
    if (event.key === 'Enter') {
        formSubmit();
    }
}

function validateName(review) {
    let name = review.name;
    console.log(review.name, typeof(review.name));
    let nameLength = name.length;
    let parent = document.querySelector('.block_leave_comment_name');
    let nameShort = parent.querySelector('.text_error_short');
    if (nameLength <= 2) {
        nameShort.textContent = '*слишком короткое имя';
        return false
    } else {
        nameShort.textContent = ''
    }
    return true
}

function errorName(){
    console.log('errorName')
    let regex = /^[a-zA-Zа-яА-ЯЁё]+$/g;
    let parent = document.querySelector('.block_leave_comment_name');
    let errorSymbol = parent.querySelector('.text_error_short');
    let isError = this.value && regex.test(this.value) === false;
    if (isError) {
        errorSymbol.textContent = '*пожалуйста, используйте только буквы для ввода имени';
        return false
    } else {
        errorSymbol.textContent = ''
    }
    return true
}

function validateReview(review) {
    console.log('validateReview');
    let stringLength = review.text.length;
    let parent = document.querySelector('.block_leave_comment_text');
    let textShort = parent.querySelector('.text_error_short');
    if (stringLength <= 100) {
        textShort.textContent = '*Отзыв должен содержать не менее 100 символов, чтобы он был полезен другим покупателям';
        return false
    } else {
        textShort.textContent = ''
    }
    return true
}

function checkDate(review){
    console.log('checkDate');
    let now = new Date();
    let today = now.toLocaleDateString();
    let revD = review.date;
    let date = revD.toLocaleDateString();
    let parent = document.querySelector('.block_leave_comment_date');
    let errorDate = parent.querySelector('.text_error_short');
    if(date > today){
        errorDate.textContent = '*Вы из будущего? К сожалению, в нашем времени эта дата ещё не наступила (';
        return false
    } else if(errorDate) {
        errorDate.textContent = ''
    }
    return true
}

function validateForm(review){
    console.log('validateForm');
    let result = checkDate(review);
    result &= validateReview(review);
    result &= validateName(review) && errorName();
    return result
}

function deleteForm(review) {
    document.addEventListener('submit', (e) => {
        e.preventDefault();
        e.target.reset();
    })
}

function gf(){
    let textShort = this.closest('.field').querySelector('.text_error_short');
    textShort.textContent = ''
}


set_event_on_click('.comment_delete', blockDelete);

set_event_on_click('.comment_like', likeTrue);

set_event_on_submit('form', formSubmit);

createComments();

set_event_on_keydown('.block_leave_comment',  enter);

set_event_on_keyup('#input_name', errorName);

set_event_on_keydown('#input_text',  gf);

set_event_on_change('#input_date',  gf);

let data = `{
    "comments":[
    {
        "name": "Алексей",
        "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim, quisquam!",
        "date": "2023-03-06T10:00:00.000Z",
        "is_like": true,
        "data_counter": "13"
    },
    {
        "name": "Anastasia",
        "text": "Lorem ipsum dolor sit amet.",
        "date": "2023-01-02T10:00:00.000Z",
        "is_like": false,
        "data_counter": "5"
    },
    {
        "name": "Юлианна",
        "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aperiam deleniti dolorem earum excepturi ipsam iusto laboriosam sed velit. Eaque?",
        "date": "2023-03-07T10:00:00.000Z",
        "is_like": false,
        "data_counter": "0"
    }
]}`

const set_event_on_click = (selector, handler) => {
    let elements = document.querySelectorAll(selector);
    for(let element of elements) {
        element.onclick = handler;
    }
}

const set_event_on_keydown = (selector, handler) => {
    let elements = document.querySelectorAll(selector);
    for(let element of elements) {
        element.onkeydown  = handler;
    }
}

const set_event_on_keyup = (selector, handler) => {
    let elements = document.querySelectorAll(selector);
    for(let element of elements) {
        element.onkeyup  = handler;
    }
}

const set_event_on_submit = (selector, handler) => {
    let elements = document.querySelectorAll(selector);
    for(let element of elements) {
        element.onsubmit = handler;
    }
}

const set_event_on_change = (selector, handler) => {
    let elements = document.querySelectorAll(selector);
    for(let element of elements) {
        element.onchange = handler;
    }
}
