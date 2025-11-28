<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    use HasFactory;

    protected $primaryKey = 'result_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'enroll_id',
        'assessment',
        'score',
        'max_score',
    ];

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class, 'enroll_id');
    }
}
