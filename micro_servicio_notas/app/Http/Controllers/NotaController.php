<?php

namespace App\Http\Controllers;

use App\Models\Nota;
use Illuminate\Http\Request;

class NotaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'actividad' => 'required',
            'nota' => 'required|numeric|min:0|max:5',
            'codEstudiante' => 'required'
        ]);

        $nota = Nota::create($request->all());
        return response()->json($nota, 201);
    }

    public function update(Request $request, $id)
    {
        $nota = Nota::find($id);
        
        if (!$nota) {
            return response()->json(['error' => 'Nota no encontrada'], 404);
        }

        $request->validate([
            'actividad' => 'required',
            'nota' => 'required|numeric|min:0|max:5'
        ]);

        $nota->update($request->all());
        return response()->json($nota);
    }

    public function destroy($id)
    {
        $nota = Nota::find($id);
        
        if (!$nota) {
            return response()->json(['error' => 'Nota no encontrada'], 404);
        }

        $nota->delete();
        return response()->json(['mensaje' => 'Nota eliminada correctamente']);
    }
}
