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
const spinner = document.getElementById('spinner')
const closemodel = document.querySelectorAll('.closemodel')
const showForm = document.querySelector(' #showForm')
const movieContainer = document.getElementById('movieContainer')


const base_url =  `https://bhagyashri-s-first-database-default-rtdb.firebaseio.com/`
const movie_url = `${base_url}/movies.json`;

//loacl state

let state = {
    movieArr : [],
    editId : null
}


//function form show handler

function onToggleFormandModel() {
    model.classList.toggle('active')
    backdrop.classList.toggle('active')
    movieForm.reset()

    addMovie.classList.remove('d-none')
    updateMovie.classList.add('d-none')
}

showForm.addEventListener('click', onToggleFormandModel)
closemodel.forEach(e => e.addEventListener('click', onToggleFormandModel))

// function for snackbar

function snackbar(msg, icon){
    Swal.fire({
        title : msg,
        icon : icon,
        timer : 3000
    })

}

//function for rating

function setRating(rating){
    if(rating >= 7){
        return 'badge-success'
    }else if(rating >= 4 && rating < 7){
        return 'badge warning'
    }else{
        return 'badge-danger'
    }
}

//function makeapicall

function makeApiCall(url, methodName, body){
    body = body ? JSON.stringify(body) : null
    return fetch(url, {
      method : methodName,
      body : body,
      headers : {
        "content-type" : "application/json",
        "auth" : "JWT Token"
      } 
    })
    .then(res =>{
        if(!res.ok){
            throw new Error(`error : ${res.status}`)
        }
        return res.json()
    })
}

//nestedobj to arr
function nestedObjToArr(obj){
    for (const key in obj) {
        obj[key].id = key

        state.movieArr.push(obj[key])
    }
}

// fetch data

function fetchMovie(){
    makeApiCall(movie_url, "GET")
    .then(data =>{
        cl(data)
        nestedObjToArr(data)
        onReadMovies(state.movieArr)
    })
}

fetchMovie()

//function read

function onReadMovies(arr){
    let res = '';

    arr.forEach(ele =>{
        res += `<div class="col-md-3 mb-4" id="${ele.id}">
                <div class="card h-100 sec-btn movieCard">
                    <div class="card-header p-3 pl-0 d-flex justify-content-between">
                        <div class="col-10 m-0 p-0">
                            <h4 class="m-0">${ele.title}</h4>
                            <small class="m-0 text-light">Created at: ${ele.createdAt}</small>
                            <small class="m-0 text-light d-none">updated at: ${ele.updatedAt}</small>
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
                                <h4 class="m-0 p-2">${ele.year}</h4>
                                <h5 class="m-0 p-2">${ele.genre}</h5>
                                <p class="m-0">${ele.description}</p>
                            </figcaption>
                        </figure>
                    </div>

                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <button type="button" class="btn btn-sm btn-outline sec-btn">Edit</button>
                        <button type="button" class="btn btn-sm btn-outline pri-btn">Remove</button>
                    </div>
                </div>
            </div>`
    })
    movieContainer.innerHTML = res;
}

function onSubmit(eve){
    eve.preventDefault();

    let newMovie = {

    }
}


movieForm.addEventListener('submit', onSubmit)


