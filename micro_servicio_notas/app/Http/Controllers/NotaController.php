<?php

namespace App\Http\Controllers;

use App\Models\Nota;
use App\Models\Estudiante;
use Illuminate\Http\Request;

class NotaController extends Controller
{
    // Mostrar todas las notas
    public function index()
    {
        $notas = Nota::all();
        return response()->json($notas);
    }

    // Crear una nota
    public function store(Request $request)
    {
        $nota = new Nota();
        $nota->actividad = $request->actividad;
        $nota->nota = $request->nota;
        $nota->codEstudiante = $request->codEstudiante;
        $nota->save();

        return response()->json(['mensaje' => 'Nota guardada']);
    }

    // Ver notas de un estudiante
    public function notasEstudiante($codEstudiante)
    {
        $estudiante = Estudiante::find($codEstudiante);
        if(!$estudiante) {
            return response()->json(['mensaje' => 'Estudiante no encontrado']);
        }

        $notas = Nota::where('codEstudiante', $codEstudiante)->get();
        return response()->json([
            'estudiante' => $estudiante->nombres,
            'notas' => $notas,
            'promedio' => $estudiante->promedio,
            'estado' => $estudiante->estado
        ]);
    }
}
