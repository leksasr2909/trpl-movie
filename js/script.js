// ======================================
// API KEY
// ======================================

const API_KEY = "6640d7c1";


// ======================================
// FUNCTION SEARCH MOVIE
// ======================================

function searchMovie() {

    // Menghapus hasil pencarian sebelumnya
    $("#movie-list").html("");


    // Mengambil keyword dari input
    let keyword = $("#search-input").val();


    // Cek apakah input kosong
    if (keyword === "") {

        $("#movie-list").html(`
            <div class="col">
                <h4 class="text-center">
                    Silakan masukkan judul film.
                </h4>
            </div>
        `);

        return;
    }


    // ======================================
    // REQUEST KE OMDb API
    // ======================================

    $.ajax({

        url: "https://www.omdbapi.com/",

        type: "GET",

        dataType: "json",

        data: {

            apikey: API_KEY,

            s: keyword

        },


        // ==================================
        // JIKA REQUEST BERHASIL
        // ==================================

        success: function (result) {

            console.log(result);


            // Apakah film ditemukan?
            if (result.Response === "True") {


                // Ambil data Search
                let movies = result.Search;


                // Loop semua film
                $.each(movies, function (i, data) {


                    // Tampilkan card film
                    $("#movie-list").append(`

                        <div class="col-md-4 mb-3">

                            <div class="card h-100">

                                ${data.Poster && data.Poster !== "N/A" ? `
                                    <img
                                        src="${data.Poster}"
                                        class="card-img-top"
                                        alt="Poster ${data.Title}"
                                        onerror="this.classList.add('d-none'); this.nextElementSibling.classList.remove('d-none')"
                                    >
                                    <div class="card-img-top bg-light text-muted d-none align-items-center justify-content-center" style="height: 450px;">
                                        Poster tidak tersedia
                                    </div>
                                ` : `
                                    <div class="card-img-top bg-light text-muted d-flex align-items-center justify-content-center" style="height: 450px;">
                                        Poster tidak tersedia
                                    </div>
                                `}

                                <div class="card-body">

                                    <h5 class="card-title">
                                        ${data.Title}
                                    </h5>

                                    <h6 class="card-subtitle mb-2 text-muted">
                                        ${data.Year}
                                    </h6>

                                    <a
                                        href="#"
                                        class="card-link see-detail"
                                        data-toggle="modal"
                                        data-target="#exampleModal"
                                        data-id="${data.imdbID}"
                                    >
                                        See Detail
                                    </a>

                                </div>

                            </div>

                        </div>

                    `);

                });

            }

            // ==================================
            // JIKA FILM TIDAK DITEMUKAN
            // ==================================

            else {

                $("#movie-list").html(`

                    <div class="col">

                        <h4 class="text-center">

                            ${result.Error}

                        </h4>

                    </div>

                `);

            }

        },


        // ==================================
        // JIKA REQUEST ERROR
        // ==================================

        error: function () {

            $("#movie-list").html(`

                <div class="col">

                    <h4 class="text-center text-danger">

                        Terjadi kesalahan saat mengakses API.

                    </h4>

                </div>

            `);

        }

    });

}


// ======================================
// SEARCH AND MOVIE DETAIL EVENTS
// ======================================

$(function () {

    $("#button-search").on("click", searchMovie);

    $("#search-input").on("keydown", function (event) {
        if (event.key === "Enter") {
            searchMovie();
        }
    });

    $("#movie-list").on("click", ".see-detail", function (event) {
        event.preventDefault();

        const imdbID = $(this).data("id");

        $(".modal-body").html(`
            <div class="text-center py-4" role="status">
                Mengambil detail film...
            </div>
        `);

        $.ajax({
            url: "https://www.omdbapi.com/",
            type: "GET",
            dataType: "json",
            data: {
                apikey: API_KEY,
                i: imdbID
            },
            success: function (movie) {
                if (movie.Response === "True") {
                    $(".modal-body").html(`
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    ${movie.Poster && movie.Poster !== "N/A" ? `
                                        <img
                                            src="${movie.Poster}"
                                            class="img-fluid"
                                            alt="Poster ${movie.Title}"
                                            onerror="this.classList.add('d-none'); this.nextElementSibling.classList.remove('d-none')"
                                        >
                                        <div class="bg-light text-muted d-none align-items-center justify-content-center" style="height: 300px;">
                                            Poster tidak tersedia
                                        </div>
                                    ` : `
                                        <div class="bg-light text-muted d-flex align-items-center justify-content-center" style="height: 300px;">
                                            Poster tidak tersedia
                                        </div>
                                    `}
                                </div>
                                <div class="col-md-8">
                                    <ul class="list-group">
                                        <li class="list-group-item">
                                            <h4>${movie.Title}</h4>
                                        </li>
                                        <li class="list-group-item">
                                            <b>Released:</b> ${movie.Released}
                                        </li>
                                        <li class="list-group-item">
                                            <b>Genre:</b> ${movie.Genre}
                                        </li>
                                        <li class="list-group-item">
                                            <b>Director:</b> ${movie.Director}
                                        </li>
                                        <li class="list-group-item">
                                            <b>Actors:</b> ${movie.Actors}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `);
                } else {
                    $(".modal-body").html(`
                        <div class="alert alert-warning" role="alert">
                            ${movie.Error || "Detail film tidak ditemukan."}
                        </div>
                    `);
                }
            },
            error: function () {
                $(".modal-body").html(`
                    <div class="alert alert-danger" role="alert">
                        Gagal mengambil detail film. Periksa koneksi internet lalu coba lagi.
                    </div>
                `);
            }
        });
    });

});