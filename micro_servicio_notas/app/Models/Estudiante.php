<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estudiante extends Model
{
    protected $table = 'estudiantes';
    protected $primaryKey = 'cod';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'cod',
        'nombres',
        'email'
    ];

    protected $appends = ['promedio', 'estado'];

    // Relación con notas
    public function notas()
    {
        return $this->hasMany(Nota::class, 'codEstudiante', 'cod');
    }

    // Calcula el promedio
    public function getPromedioAttribute()
    {
        $notas = $this->notas;
        if(count($notas) == 0) {
            return 0;
        }

        $suma = 0;
        foreach($notas as $nota) {
            $suma += $nota->nota;
        }

        return round($suma / count($notas), 2);
    }

    // Determina si aprobó
    public function getEstadoAttribute()
    {
        if($this->getPromedioAttribute() >= 3) {
            return "Aprobado";
        } else {
            return "Reprobado";
        }
    }
}
