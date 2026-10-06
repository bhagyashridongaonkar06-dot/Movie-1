const cl = console.log;


const model = document.getElementById('model')
const movieForm = document.getElementById('movieForm')
const backdrop = document.getElementById('backdrop')
const addMovie = document.getElementById('addMovie')
const updateMovie = document.getElementById('updateMovie')
const title = document.getElementById('title')
const poster = document.getElementById('poster')
const rating = document.getElementById('rating')
const genres = document.getElementById('genres')
const releaseDate = document.getElementById('releaseDate')
const description = document.getElementById('description')
const createdAt = document.getElementById('createdAt')
const updatedAt = document.getElementById('updatedAt')
const spinner = document.getElementById('spinner')
const closemodel = document.querySelectorAll('.closemodel')
const showForm = document.querySelector('#showForm')
const heading = document.querySelector(' .heading')
const movieContainer = document.getElementById('movieContainer')


const base_url = `https://bhagyashri-s-first-database-default-rtdb.firebaseio.com/`
const movie_url = `${base_url}/movies.json`;

//loacl state

let state = {
    movieArr: [],
    editId: null
}


//function form show handler

function onModelToggle() {
    heading.innerText = "Add Movie"
    model.classList.toggle('active')
    backdrop.classList.toggle('active');
    movieForm.reset();
    addMovie.classList.remove("d-none");
    updateMovie.classList.add("d-none");

}



showForm.addEventListener('click', onModelToggle)
closemodel.forEach(e => e.addEventListener('click', onModelToggle))

// function for snackbar

function snackbar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })

}
//spinner

function handleSpinner(flag) {
    if (flag) {
        spinner.classList.remove('d-none')
    } else {
        spinner.classList.add('d-none')
    }
}

//function for rating

function setRating(rating) {
    if (rating > 7) {
        return 'badge-success'
    } else if (rating > 4 && rating <= 7) {
        return 'badge-warning'
    } else {
        return 'badge-danger'
    }
}

//function makeapicall

function makeApiCall(url, methodName, body) {
    body = body ? JSON.stringify(body) : null
    return fetch(url, {
        method: methodName,
        body: body,
        headers: {
            "content-type": "application/json",
            "auth": "JWT Token"
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`error : ${res.status}`)
            }
            return res.json()
        })

}

//nestedobj to arr
function nestedObjToArr(obj) {
    for (const key in obj) {
        obj[key].id = key

        state.movieArr.unshift(obj[key])
        // cl(state.movieArr)
    }
}

// fetch data

function fetchMovie() {
    handleSpinner(true)
    makeApiCall(movie_url, "GET")
        .then(data => {
            // cl(data)
            nestedObjToArr(data)
            onReadMovies(state.movieArr)
        })
        .catch(err => {
            snackbar(err, 'error')
        })
        .finally(() => {
            handleSpinner()
        })

}

fetchMovie()

//function read

function onReadMovies(arr) {
    let res = '';

    arr.forEach(ele => {
        res += `<div class="col-md-3 mb-4" id="${ele.id}">
                <div class="card h-100 sec-btn movieCard">
                    <div class="card-header p-3 pl-0 d-flex justify-content-between">
                        <div class="col-10 m-0 p-0">
                            <h4 class="m-0">${ele.title}</h4>
                            <small class="m-0 text-light">Created at: ${new Date(ele.createdAt).toLocaleString("en-IN")}</small>
                            </div>
                            <div class="col-2 mr-0">
                            <h5 class="m-0 mr-3"><span class="badge ${setRating(ele.rating)}">${ele.rating}</span></h5>
                            </div>
                            </div>
                            
                            <div class="card-body py-0 p-0 pr-2 pl-2 m-0">
                            <figure class="m-0 p-0">
                            <img src="${ele.poster}"
                            alt="${ele.title}">
                            
                            <figcaption>
                            <h4 class="m-0 p-2">${ele.title}</h4>

                            <small class="p-2">Relase Date : <span class="">${ele.year}</span></small>
                            <h4 class="m-0 p-2 genre"><span>Genre : </span>${ele.genre}</h4><br>
                            <p class="m-0 p-2">${ele.description}</p>
                            </figcaption>
                            </figure>
                            ${ele.updatedAt ? `<small class="m-0 text-light">updated at: ${ele.updatedAt}</small>` : ""}
                    </div>

                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <button onclick="onEdit(this)" type="button" class="btn btn-sm btn-outline sec-btn">Edit</button>
                        <button onclick="onDelete(this)" type="button" class="btn btn-sm btn-outline pri-btn">Remove</button>
                    </div>
                </div>
            </div>`
    })
    movieContainer.innerHTML = res;
}

function onSubmit(eve) {
    eve.preventDefault();


    let newMovie = {
        title: title.value,
        description: description.value,
        rating: rating.value,
        year: releaseDate.value,
        genre: genres.value,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        poster: poster.value
    }
    // cl(newMovie)
//    onModelToggle()
    handleSpinner(true)

    makeApiCall(movie_url, "POST", newMovie)
        .then(data => {
            newMovie.id = data.name
            state.movieArr.unshift(newMovie)

            let card = document.createElement("div")
            card.id = data.name
            card.className = 'col-md-3 mb-4'
            card.innerHTML = `<div class="card h-100 sec-btn movieCard">
                    <div class="card-header p-3 pl-0 d-flex justify-content-between">
                        <div class="col-10 m-0 p-0">
                            <h4 class="m-0">${newMovie.title}</h4>
                            <small class="m-0 text-light">Created at: ${new Date(newMovie.createdAt).toLocaleString("en-IN")}</small>
                            </div>
                            <div class="col-2 mr-0">
                            <h5 class="m-0 mr-3"><span class="badge ${setRating(newMovie.rating)}">${newMovie.rating}</span></h5>
                            </div>
                            </div>
                            
                            <div class="card-body py-0 p-0 pr-2 pl-2 m-0">
                            <figure class="m-0 p-0">
                            <img src="${newMovie.poster}"
                            alt="${newMovie.title}">
                            
                            <figcaption>
                             <h4 class="m-0 p-2">${newMovie.title}</h4>

                            <small class="p-2">Relase Date :</small>
                            <h6 class="m-0 p-2">${newMovie.year}</h6>
                            <small>Relase Date : <span class="">${newMovie.year}</span></small>
                            <h4 class="m-0 p-2 genre"><span>Genre : </span>${newMovie.genre}</h4><br>
                            </figcaption>
                            </figure>
                            ${newMovie.updatedAt ? `<small class="m-0 text-light d-none">updated at: ${newMovie.updatedAt}</small>` : ""}
                    </div>

                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <button onclick="onEdit(this)" type="button" class="btn btn-sm btn-outline sec-btn">Edit</button>
                        <button onclick="onDelete(this)" type="button" class="btn btn-sm btn-outline pri-btn">Remove</button>
                    </div>
                </div>`
            snackbar(`New Movie ${newMovie.title} Added successfully`, 'success')
            movieContainer.prepend(card)
            onModelToggle()
        })
        .catch(err => {
            snackbar(err, 'error')
        })
        .finally(() => {
            handleSpinner()
        })

}

function onEdit(ele) {
    let editId = ele.closest('.col-md-3').id;
    cl(editId)
    let edit_url = `${base_url}/movies/${editId}.json`

   onModelToggle()
    makeApiCall(edit_url, "GET")
        .then(data => {
            cl(data)
            state.editId = editId

            // let editObj = state.movieArr.find(e => e.id === editId)
            // cl(editObj)

            title.value = data.title
            description.value = data.description
            releaseDate.value = data.year
            genres.value = data.genre
            poster.value = data.poster
            let edit = rating.value = data.rating
            cl(data.rating)

            // createdAt.value = editObj.createdAt
            // updatedAt.value = editObj.updatedAt

            heading.innerText = 'Update Movie'


            addMovie.classList.add('d-none')
            updateMovie.classList.remove('d-none')
        })
        .catch(err => {
            snackbar(err, 'error')
        })
        .finally(() => {
            handleSpinner()
        })

}

function onUpdate() {
    handleSpinner(true)
    let updateId = state.editId
    // cl(updateId)

    let update_url = `${base_url}/movies/${updateId}.json`

    // if(!title.value) {
    //     snackbar("Invalid rating. please select rating betweeen 1 to 10");
    //     return;
    // }

    // if(rating.value < 0 || rating.value > 10) {
    //     snackbar("Invalid rating. please select rating betweeen 1 to 10");
    //     return;
    // }

    let updateObj = {
        title: title.value,
        description: description.value,
        rating: rating.value,
        year: releaseDate.value,
        genre: genres.value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        poster: poster.value,
        id: updateId
    }
    // cl(updateObj)
    // movieForm.reset()
//    onModelToggle()
    makeApiCall(update_url, "PATCH", updateObj)
        .then(data => {
            // cl(data)

            let getIndex = state.movieArr.findIndex(e => e.id === updateId)
            state.movieArr[getIndex] = updateObj

            let col = document.getElementById(updateId)
            col.id = data.id
            col.innerHTML = `<div class="card h-100 sec-btn movieCard">
                                <div class="card-header p-3 pl-0 d-flex justify-content-between">
                                    <div class="col-10 m-0 p-0">
                                         <h4 class="m-0">${updateObj.title}</h4>
                                        <small class="m-0 text-light">Created at: ${new Date(updateObj.createdAt).toLocaleString("en-IN")}</small>
                                    </div>
                                    <div class="col-2 mr-0">
                                        <h5 class="m-0 mr-3"><span class="badge ${setRating(updateObj.rating)}">${updateObj.rating}</span></h5>
                                    </div>
                                </div>
                            
                                <div class="card-body py-0 p-0 pr-2 pl-2 m-0">
                                    <figure class="m-0 p-0">
                                        <img src="${updateObj.poster}"
                                            alt="${updateObj.title}">
                            
                                        <figcaption>
                                            <h4 class="m-0 p-2">${updateObj.title}</h4>
                                            <small class="p-2">Relase Date : <span class="">${updateObj.year}</span></small>
                                            <h4 class="m-0 p-2 genre"><span>Genre : </span>${updateObj.genre}</h4><br>
                                            <p class="m-0 p-2">${updateObj.description}</p>
                                        </figcaption>
                                    </figure>
                                    ${updateObj.updatedAt ? `<small class="m-0 text-light">updated at: ${new Date(updateObj.updatedAt).toLocaleString("en-IN")}</small>` : ""}
                                </div>

                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <button onclick="onEdit(this)" type="button" class="btn btn-sm btn-outline sec-btn">Edit</button>
                        <button onclick="onDelete(this)" type="button" class="btn btn-sm btn-outline pri-btn">Remove</button>
                    </div>
                </div>`
            movieForm.reset()
            snackbar(`New Movie ${updateObj.title} updated successfully`, 'success')
            onModelToggle()
            // addMovie.classList.add('d-none')
            // updateMovie.classList.remove('d-none')
        })
        .catch(err => {
            snackbar(err, 'error')
        })
        .finally(() => {
            handleSpinner()
        })
}


function onDelete(ele) {
    let deleteId = ele.closest('.col-md-3').id;
    // cl(deleteId)

    let delete_url = `${base_url}/movies/${deleteId}.json`


    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            handleSpinner(true)
            makeApiCall(delete_url, "DELETE")
                .then(data => {
                    // cl(data)
                    let getIndex = state.movieArr.findIndex(e => e.id === deleteId)
                    state.movieArr.splice(getIndex, 1)

                    ele.closest('.col-md-3').remove()
                    snackbar(`movie with id ${deleteId} deleted successfully`, 'success')
                })
                .catch(err => {
                    snackbar(err, 'error')
                })
                .finally(() => {
                    handleSpinner()
                })
        }
    });
}


movieForm.addEventListener('submit', onSubmit)
updateMovie.addEventListener('click', onUpdate)

