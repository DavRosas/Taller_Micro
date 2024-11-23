<?php

use App\Http\Controllers\EstudianteController;
use App\Http\Controllers\NotaController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::prefix("app")->group(function() {
    // Rutas para estudiantes
    Route::controller(EstudianteController::class)->group(function(){
        Route::get("/estudiantes", "index");
        Route::post("/estudiantes", "store");
        Route::get("/estudiantes/{cod}", "show");
        Route::put("/estudiantes/{cod}", "update");
        Route::delete("/estudiantes/{cod}", "destroy"); // Nueva ruta
        Route::get('/estudiantes/{cod}/notas', [EstudianteController::class, 'obtenerNotas']);
    });

    // Rutas para notas
    Route::controller(NotaController::class)->group(function(){
        Route::get("/notas", "index");
        Route::post("/notas", "store");
        Route::get("/notas/estudiante/{codEstudiante}", "notasEstudiante");
        Route::put("/notas/{id}", "update");
        Route::delete('/notas/{id}', [NotaController::class, 'destroy']);
    });
});
