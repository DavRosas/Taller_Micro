<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nota extends Model
{
    protected $table = 'notas';
    protected $primaryKey = 'id';
    public $timestamps = false;   // Si no usas created_at y updated_at

    protected $fillable = [
        'actividad',
        'nota',
        'codEstudiante'
    ];

    // Relación con estudiante
    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'codEstudiante', 'cod');
    }
}
