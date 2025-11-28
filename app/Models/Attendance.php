<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $primaryKey = 'attendance_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'enroll_id',
        'date',
        'status',
    ];

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class, 'enroll_id');
    }
}
