<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Attendance;
use App\Models\Result;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        // Basic data load; in production apply pagination and authorization
        $users = User::select('id', 'name', 'email', 'role')->get();
        $courses = Course::select('course_id', 'title', 'teacher_id', 'credits')->get();
        $enrollments = Enrollment::select('enroll_id', 'student_id', 'course_id', 'enrolled_at')->get();
        $attendance = Attendance::select('attendance_id', 'enroll_id', 'date', 'status')->get();
        $results = Result::select('result_id', 'enroll_id', 'assessment', 'score', 'max_score')->get();

        return Inertia::render('AdminDashboard', [
            'users' => $users,
            'courses' => $courses,
            'enrollments' => $enrollments,
            'attendance' => $attendance,
            'results' => $results,
        ]);
    }
}
