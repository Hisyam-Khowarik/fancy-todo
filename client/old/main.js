let baseURL = 'http://localhost:3000'

$(document).ready(function (event) {
    checkauth()
})

function checkauth() {
    if (localStorage.access_token) {
        $('#regisbox').hide();
        $('#loginbox').hide();
        $('.notlogged-in').hide();
        $('#add-todo').show();
        $('#edit-todo').hide();
        $('#add-form').show()
        $('#logout').show()
        list()
    } else {
        $('#loginbox').show();
        $('#regisbox').hide();
        $('#add-todo').hide();
        $('.notlogged-in').show();
        $('#logout').hide()
        $('#get-todo').hide()
    }
}

function showRegister(event) {
    event.preventDefault()
    $('#loginbox').hide()
    $('#regisbox').show()
    $('#logout').hide()
}

function showLogin(event) {
    event.preventDefault()
    $('#loginbox').show()
    $('#regisbox').hide()
    $('#logout').hide()
    $('.afterlogin').hide();
}

function logout(e) {
    e.preventDefault()
    localStorage.removeItem('access_token')
    $('#loginbox').show()
    $('#regisbox').hide()
    $('#add-form').hide()
    $('#get-todo').hide()
    $('#logout').hide()
    $('.notlogged-in').show()
}

function login(event) {
    event.preventDefault()
    let email = $('#emaillogin').val()
    let password = $('#passwordlogin').val()

    $.ajax({
        method: 'POST',
        url: baseURL + '/login',
        data: { email, password }
    })
    .done(result => {
        localStorage.setItem('access_token', result.access_token)
        console.log(result)
        checkauth()
    })
    .fail(error => {
        console.log(error)
    })
}

function register(event) {
    event.preventDefault()
    let email = $('#emailregis').val()
    let password = $('#passwordregis').val()

    $.ajax({
        method: 'POST',
        url: baseURL + '/register',
        data: { email, password }
    })
    .done(result => {
        console.log(result)
        showLogin()
    })
    .fail(error => {
        console.log(error)
    })
}

function addForm(event) {
    event.preventDefault()
    let access_token = localStorage.getItem('access_token');
    let title = $('#title').val()
    let description = $('#description').val()
    let status = $('#status').val()
    let due_date = $('#due_date').val()
    $.ajax({
        method: 'POST',
        url: baseURL + '/todos',
        data: {title, description, status, due_date},
        headers: {access_token}
    })
    .done(result => {
        console.log(result)
    })
    .fail(error => {
        console.log(error)
    })
}

function list(event) {
    // event.preventDefault()
    let access_token = localStorage.getItem('access_token')
    $.ajax({
        method: 'GET',
        url: baseURL + '/todos',
        headers: {access_token}
    })
    .done(result => {
        result.forEach(el => {
            $('#list-todo').append(
                `<tr>
                    <td>${el.title}</td>
                    <td>${el.description}</td>
                    <td>${el.status}</td>
                    <td>${el.due_date}</td>
                    <td><button type="submit" class="btn btn-primary mb-2" onclick="editForm(${el.id})">Edit</button>
                    <button type="submit" class="btn btn-danger mb-2" role="button" onclick="confirmDelete(${el.id})">Delete</button>
                    </td>
                </tr>`
            )
            
        });
        // console.log(result)
        // console.log(access_token)
        checkauth()
    })
    .fail(error => {
        console.log(error)
    }) 
}



