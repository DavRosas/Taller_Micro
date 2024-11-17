<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use Illuminate\Http\Request;

class EstudianteController extends Controller
{
    // Mostrar todos los estudiantes
    public function index()
    {
        $estudiantes = Estudiante::with('notas')->get();
        return response()->json($estudiantes);
    }

    // Crear un estudiante
    public function store(Request $request)
    {
        // Validar si existe el código o email
        $existeCodigo = Estudiante::where('cod', $request->cod)->exists();
        $existeEmail = Estudiante::where('email', $request->email)->exists();

        if ($existeCodigo) {
            return response()->json(['error' => 'El código ya existe'], 400);
        }

        if ($existeEmail) {
            return response()->json(['error' => 'El email ya existe'], 400);
        }

        $estudiante = new Estudiante();
        $estudiante->cod = $request->cod;
        $estudiante->nombres = $request->nombres;
        $estudiante->email = $request->email;
        $estudiante->save();

        return response()->json(['mensaje' => 'Estudiante creado']);
    }

    // Buscar un estudiante
    public function show($cod)
    {
        $estudiante = Estudiante::with('notas')->find($cod);
        return response()->json($estudiante);
    }

    // Actualizar un estudiante
    public function update(Request $request, $cod)
    {
        $estudiante = Estudiante::find($cod);

        // Validar si existe el código o email (excepto el actual)
        $existeCodigo = Estudiante::where('cod', $request->cod)
            ->where('cod', '!=', $cod)
            ->exists();
        
        $existeEmail = Estudiante::where('email', $request->email)
            ->where('cod', '!=', $cod)
            ->exists();

        if ($existeCodigo) {
            return response()->json(['error' => 'El código ya existe'], 400);
        }

        if ($existeEmail) {
            return response()->json(['error' => 'El email ya existe'], 400);
        }

        $estudiante->cod = $request->cod;
        $estudiante->nombres = $request->nombres;
        $estudiante->email = $request->email;
        $estudiante->save();

        return response()->json(['mensaje' => 'Estudiante actualizado']);
    }

    // Eliminar un estudiante
    public function destroy($cod)
    {
        $estudiante = Estudiante::find($cod);
        
        if(!$estudiante) {
            return response()->json(['error' => 'Estudiante no encontrado'], 404);
        }

        // Verificar si tiene notas
        $tieneNotas = $estudiante->notas()->count() > 0;
        
        if($tieneNotas) {
            return response()->json([
                'error' => 'No se puede eliminar el estudiante porque tiene notas registradas'
            ], 400);
        }

        $estudiante->delete();
        return response()->json(['mensaje' => 'Estudiante eliminado']);
    }
}
