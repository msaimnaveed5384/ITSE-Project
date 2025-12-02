<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Mark;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{

    public function teacherDashboard(){
    
    $user = User::find(Auth::user()->id);
    $students = Enrollment::join('users', 'enrollments.student_id', '=', 'users.id')
                            ->join('courses', 'enrollments.course_id', '=', 'courses.id')
                            ->select('users.id as stid','courses.id as cid','enrollments.id as eid','users.name as uname','courses.name as cname')
                            ->where('courses.teacher_id', Auth::user()->id)
                            ->get();
    $courses = Course::where('teacher_id', Auth::user()->id)->get();
    $enrollments = Enrollment::join('courses', 'enrollments.course_id', '=', 'courses.id')
                            ->join('users', 'enrollments.student_id', '=', 'users.id')
                            ->where('courses.teacher_id', Auth::user()->id)
                            ->select('enrollments.*', 'courses.name as course_title', 'users.name as uname', 'courses.teacher_id as ctid')
                            ->get();
    
        return Inertia::render('TeacherDashboard', [
            'user' => $user, 
            'courses' => $courses,
            'enrollments' => $enrollments,
            'students' => $students
        ]);    
    }

    public function uploadMarks(Request $req){
        // dd($req);
        // Expect payload: courseId, type, total_marks, marks => [{ studentId, obtained_marks }, ...]
        $validator = Validator::make($req->all(), [
            'courseId' => 'required|integer|exists:courses,id',
            'type' => 'required|in:Exam,Quiz,Assignment,Project',
            'total_marks' => 'required|integer|min:0',
            
            'studentId' => 'required|integer|exists:users,id',
            'obtained_marks' => 'required'
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', $validator->errors()->first());
        }

        // Ensure teacher owns the course
        $course = Course::find($req->courseId);
        if (!$course || $course->teacher_id != Auth::user()->id) {
            return redirect()->back()->with('message', 'You are not authorized to upload marks for this course.');
        }
        //type casting for student id and course id
        $req->student_id = (int)$req->studentId;
        $req->courseId = (int)$req->courseId;
        $enrollId = Enrollment::where('student_id', $req->student_id)
                            ->where('course_id', $req->courseId)
                            ->first();
                            // dd($enrollId);
        if (!$enrollId) {
            return redirect()->back()->with('message', 'The specified student is not enrolled in this course.');
        }
        
        //enter marks in marks table
        
        Mark::create([
            'enroll_id' => $enrollId->id,
            'marked_by' => Auth::id(),
            'type' => $req->type,
            'total_marks' => $req->total_marks,
            'obtained_marks' => $req->obtained_marks,
           
        ]);
       

        return redirect()->back()->with('success', "Marks Uploaded Successfully.");
    }

   public function markAttendance(Request $req)
{
    // Convert attendance associative array => list of arrays
    // Input: [2 => "P", 3 => "P"]
    // Output: [ ["enroll_id" => 2, "status" => "P"], ... ]
    $attendances = collect($req->attendance)->map(function ($status, $enrollId) {
        return [
            'enroll_id' => $enrollId,
            'status' => $status
        ];
    })->values()->toArray();

    // Validate
    $validator = Validator::make([
        'date' => $req->date,
        'course_id' => $req->course_id,
        'attendances' => $attendances
    ], [
        'date' => 'required|date',
        'course_id' => 'required|integer|exists:courses,id',

        'attendances' => 'required|array|min:1',
        'attendances.*.enroll_id' => 'required|integer|exists:enrollments,id',
        'attendances.*.status' => 'required|in:P,A,L'
    ]);

    if ($validator->fails()) {
        return back()->with('message', $validator->errors()->first());
    }

    // Ensure teacher owns the course
    $course = Course::find($req->course_id);
    if (!$course || $course->teacher_id != Auth::id()) {
        return back()->with('message', 'You are not authorized to mark attendance for this course.');
    }

    $created = 0;

    foreach ($attendances as $a) {
        $enroll = Enrollment::find($a['enroll_id']);

        if (!$enroll) {
            continue;
        }

        // Ensure enrollment belongs to the selected course
        if ($enroll->course_id != $req->course_id) {
            return back()->with('message', "Enrollment ID {$a['enroll_id']} does not belong to this course.");
        }

        // Prevent duplicate attendance
        $exists = Attendance::where('enroll_id', $a['enroll_id'])
            ->where('date', $req->date)
            ->exists();

        if ($exists) {
            $student = User::find($enroll->student_id);
            $name = $student ? $student->name : 'Student';
            return back()->with('message', "Attendance for {$name} on {$req->date} already exists.");
        }

        // Save attendance
        Attendance::create([
            'enroll_id' => $a['enroll_id'],
            'markby' => Auth::id(),
            'status' => $a['status'],
            'date' => $req->date,
            'student_id' => $enroll->student_id,
            'course_id' => $enroll->course_id,
        ]);

        $created++;
    }

    return back()->with('success', "Saved {$created} attendance records.");
}

    public function studentDashboard(){
        // Current authenticated user
        $user = User::find(Auth::user()->id);

        // Enrollments for this student with course relation when available
        $enrollments = Enrollment::where('student_id', Auth::user()->id)
                        ->get();

        // Courses the student is enrolled in
        $courseIds = $enrollments->pluck('course_id')->unique()->filter()->values();
        $courses = $courseIds->isEmpty() ? collect() : Course::whereIn('id', $courseIds)->get();

        // Attendance records for this student
        $attendances = Attendance::where('student_id', Auth::user()->id)->get();

        // Marks for this student's enrollments
        $enrollIds = $enrollments->pluck('id')->unique()->filter()->values();
        $marks = $enrollIds->isEmpty() ? collect() : Mark::whereIn('enroll_id', $enrollIds)->get();

        return Inertia::render('StudentDashboard', [
            'user' => $user,
            'enrollments' => $enrollments,
            'courses' => $courses,
            'attendances' => $attendances,
            'marks' => $marks,
        ]);
    }
    public function adminDashboard(){
    
        $users = User::all()->where('role','!=','admin');
        $courses = Course::all();
        $enroll = Enrollment::all();
        return Inertia::render('AdminDashboard',['users'=>$users, 'courses'=> $courses, 'enrollments'=>$enroll]);

    }

    public function enrollStudent(Request $req){
        $validator = Validator::make($req->all(), [
            'student_id' => 'required|integer|exists:users,id',
            'course_id' => 'required|integer|exists:courses,id'
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', $validator->errors()->first());
        }

        // ensure student is not already enrolled in this course
        $exists = Enrollment::where('student_id', $req->student_id)
                            ->where('course_id', $req->course_id)
                            ->exists();
        if ($exists) {
            return redirect()->back()->with('message', 'Student is already enrolled in this course.');
        }

        Enrollment::create([
            'student_id' => $req->student_id,
            'course_id' => $req->course_id
        ]);

        return redirect()->back()->with('success', 'Student enrolled successfully.');
    }
    public function addUser(Request $req){
        $validator = Validator::make($req->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'username' => 'required|string|max:100|unique:users,username',
            'password' => 'required|confirmed|min:6',
            'role' => 'required|in:student,teacher',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', $validator->errors()->first());
        }

        User::create([
            'name' => $req->name,
            'email' => $req->email,
            'username' => $req->username,
            'password' => Hash::make($req->password),
            'role' => $req->role,
        ]);

        return redirect()->back()->with('success', 'User created successfully.');
    }

    public function addcourse(Request $req){
        $validator = Validator::make($req->all(), [
            'name' => 'required|string|max:255',
            'credits' => 'required|integer|min:0',
            'teacher_id' => 'required|integer|exists:users,id'
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', $validator->errors()->first());
        }

        // Prevent duplicate course entries (unique course name)
        if (Course::where('name', $req->name)->exists()) {
            return redirect()->back()->with('message', 'A course with this name already exists.');
        }

        // Prevent assigning the same teacher to the same course again (defensive)
        if (Course::where('name', $req->name)->where('teacher_id', $req->teacher_id)->exists()) {
            return redirect()->back()->with('message', 'This course is already assigned to the selected teacher.');
        }

        Course::create([
            'name' => $req->name,
            'credits' => $req->credits,
            'teacher_id' => $req->teacher_id,
        ]);

        return redirect()->back()->with('success', 'Course created successfully.');
    }
    public function Login(Request $req){
        $data = $req->validate([
            'username' => 'required',
            'password' => 'required'
        ]);
        $vari = "NOT";
        if(Auth::attempt($data)){
            if(Auth::user()->role == "admin"){

                return redirect('/dashboard/admin');
            }
            else if(Auth::user()->role == "teacher"){
                return redirect('/dashboard/teacher');
            }
            else if(Auth::user()->role == "student"){
                return redirect('/dashboard/student');
            }
        }

        else{
            return redirect()->back()->withErrors(['login_error' => 'Invalid username or password.']);
        }
    }

    

}
