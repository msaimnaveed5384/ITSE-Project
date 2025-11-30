<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'enroll_id',
        'markby',
        'status',
        'date',
        'student_id',
        'course_id',
    ];
}
