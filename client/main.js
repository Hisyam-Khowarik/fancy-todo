let baseURL = 'http://localhost:3000'

$(document).ready(function() {
    checkauth()
})

function checkauth() {
    if (localStorage.access_token) {
        $('#loginbox').hide()
        $('#regisbox').hide()
        $('#add-todo').show()
        $('#get-todo').show()
        $('#logout').show()
        $('#edit-todo').hide()
        todoList()
        $('#nav-log').hide()
        $('#nav-reg').hide()
    } else {
        $('#loginbox').show()
        $('#regisbox').hide()
        $('#add-todo').hide()
        $('#get-todo').hide()
        $('#logout').hide()
        $('#nav-log').show()
        $('#nav-reg').show()
        $('#edit-todo').hide()
    }
}

function logout(event) {
    event.preventDefault()
    localStorage.removeItem('access_token')
    checkauth()
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

function showRegister(event) {
    event.preventDefault()
    $('#loginbox').hide()
    $('#regisbox').show()
}

function showLogin(event) {
    event.preventDefault()
    $('#loginbox').show()
    $('#regisbox').hide()
}

function showAdd(event) {
    event.preventDefault()
    $('#edit-todo').hide();
    $('#add-todo').show();
}

function login(event) {
    event.preventDefault()
    let email = $('#emaillogin').val()
    let password = $('#passwordlogin').val()

    $.ajax({
        method: 'POST',
        url: baseURL + '/login',
        data: {email, password}
    })
    .done(res => {
        localStorage.setItem('access_token', res.access_token)
        checkauth()
        Swal.fire(
            'Welcome!',
            'Welcome to the todo aoo',
            'success'
        )
    })
    .fail(err => {
        Swal.fire(
            'Error!!!',
            'Wrong email/password',
            'error'
        )
    })
}

function register(event) {
    event.preventDefault()
    let email = $('#emailregis').val()
    let password = $('#passwordregis').val()

    $.ajax({
        method: 'POST',
        url: baseURL + '/register',
        data: {email, password}
    })
    .done(res => {
        showLogin()
        Swal.fire(
            'Good job!',
            'Welcome to the todo aoo',
            'success'
        )
    })
    .fail(err => {
        Swal.fire(
            'Error!!!',
            'Password must be more than 6 characters',
            'error'
        )
    })
}

function addTodo(event) {
    event.preventDefault()
    let access_token = localStorage.getItem('access_token')
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
    .done(res => {
        checkauth()
    })
    .fail(err => {
        Swal.fire(
            'Error!!!',
            'Please chek your inputed',
            'error'
        )
    })
}

function todoList(event) {
    let access_token = localStorage.getItem('access_token')
    $.ajax({
        method: 'GET',
        url: baseURL + '/todos',
        headers: {access_token}
    })
    .done(res => {
        res.forEach(el => {
            let dudet = ''
            for (let i = 0; i < el.due_date.length; i++) {
                if (dudet.length !== 10) {
                    dudet += el.due_date[i]
                }
            }
            $('#list-todo').append(
                `<tr>
                    <td>${el.title}</td>
                    <td>${el.description}</td>
                    <td>${el.status}</td>
                    <td>${dudet}</td>
                    <td>
                    <button type="submit" class="btn btn-primary mb-2" onclick="editForm(${el.id})">Edit</button>
                    <button type="submit" class="btn btn-danger mb-2" role="button" onclick="confirmDelete(${el.id})">Delete</button>
                    </td>
                </tr>`
            )
        });
    })
    .fail(err => {
        console.log(err)
    })
}

function editForm(id) {
    let access_token = localStorage.getItem('access_token')
    $.ajax({
        method: 'GET',
        url: baseURL + `/todos/${id}`,
        headers: {access_token}
    })
    .done(res => {
        $('#edit-todo').show()
        $('#add-todo').hide()
        $('#edit-id').val(res.id)
        $('#edit-title').val(res.title)
        $('#edit-description').val(res.description)
        $('#edit-status').val(res.status)
        $('#edit-due_date').val(res.due_date)
    })
    .fail(err => {

    })
}

function editTodo(event) {
    event.preventDefault()
    let access_token = localStorage.getItem('access_token')
    let id = $('#edit-id').val()
    let title = $('#edit-title').val()
    let description = $('#edit-description').val()
    let status = $('#edit-status').val()
    let due_date = $('#edit-due_date').val()

    $.ajax({
        method: 'PUT',
        url: baseURL + `/todos/${id}`,
        headers: {access_token},
        data: {
            title,
            description,
            status,
            due_date
        }
    })
    .done(res => {
        event.preventDefault()
        $('#edit-todo').show();
        $('#add-todo').hide();
        todoList()
        $('#edit-id').val('');
        $('#edit-title').val('');
        $('#edit-description').val('');
        $('#edit-status').val('');
        $('#edit-due_date').val('');
        $('#errorEdit').hide();
    })
    .fail(err => {
        Swal.fire(
            'Error!!!',
            'Please check your inputed',
            'error'
        )
    })
}

function confirmDelete(id) {
    $('#deleteModal').modal('show')
    $('#delete-id').val(id)
}

function deleteTodo(event) {
    let access_token = localStorage.getItem('access_token')
    let id = $('#delete-id').val()

    $.ajax({
        method: 'DELETE',
        url: baseURL + `/todos/${id}`,
        headers: {access_token}
    })
    .done(res => {
        $('#deleteModal').modal('hide')
        todoList()
    })
    .fail(err => {
        console.log(err)
    })

}

function onSignIn(googleUser) {
    var google_access_token = googleUser.getAuthResponse().id_token
    $.ajax({
        method: 'POST',
        url: baseURL + '/loginGoogle',
        data: {google_access_token}
    })
    .done(res => {
        localStorage.setItem('access_token', res.access_token)
        $('#emaillogin').val('')
        $('#passwordlogin').val('')
        checkauth()
    })
    .fail(err => {
        console.log(err)
    })
}
