<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Attendance;
use App\Models\Result;
use App\Models\User;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Load teacher's courses; for now, fetch all courses where teacher_id=user id
        $courses = Course::where('teacher_id', $user->id)
            ->select('course_id','title','credits')
            ->get();

        // simple enrollments list for teacher's courses
        $enrollments = Enrollment::whereIn('course_id', $courses->pluck('course_id'))
            ->select('enroll_id','student_id','course_id')
            ->get()
            ->map(function($e){
                // attach student name and course title if available
                $e->student_name = optional($e->student)->name ?? $e->student_id;
                $e->course_title = optional($e->course)->title ?? $e->course_id;
                return $e;
            });

        $attendance = Attendance::whereIn('enroll_id', $enrollments->pluck('enroll_id'))
            ->select('attendance_id','enroll_id','date','status')
            ->get();

        $results = Result::whereIn('enroll_id', $enrollments->pluck('enroll_id'))
            ->select('result_id','enroll_id','assessment','score','max_score')
            ->get();

        return Inertia::render('TeacherDashboard', [
            'user' => $user,
            'courses' => $courses,
            'enrollments' => $enrollments,
            'attendance' => $attendance,
            'results' => $results,
        ]);
    }

    // placeholders for actions (mark attendance, upload marks, announcements)
    public function markAttendance(Request $request)
    {
        // validate and create attendance record
        $request->validate(['enroll_id'=>'required|integer','status'=>'required|string']);
        Attendance::create($request->only('enroll_id','status','date'));
        return redirect()->back();
    }

    public function uploadResults(Request $request)
    {
        // handle CSV upload; placeholder
        // $request->file('marks_csv')
        return redirect()->back();
    }

    public function postAnnouncement(Request $request)
    {
        $request->validate(['message'=>'required|string|max:2000']);
        // persist announcement (not implemented) - placeholder
        return redirect()->back();
    }
}
