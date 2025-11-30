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
        // Expect payload: courseId, type, total_marks, marks => [{ studentId, obtained_marks }, ...]
        $data = $req->validate([
            'courseId' => 'required|integer',
            'type' => 'required|in:Exam,Quiz,Assignment,Project',
            'total_marks' => 'required|integer',
            'marks.*.studentId' => 'required',
            'marks.*.obtained_marks' => 'required|integer'
        ]);
        // dd($data);
        $created = 0;
        foreach ($req->marks as $m) {
            // find enrollment for student in the course
            $enroll = Enrollment::where('student_id', $m['studentId'])->where('course_id', $req->courseId)->first();
            if (!$enroll) {
                // skip if enrollment not found
                continue;
            }
           
            Mark::create([
                'enroll_id' => $enroll->id,
                'type' => $req->type,
                'total_marks' => $req->total_marks,
                'obtained_marks' => $m['obtained_marks'],
                'marked_by' => Auth::user()->id,
            ]);
            $created++;
        }

        return redirect()->back()->with('message', "Uploaded {$created} marks");
    }

    public function markAttendance(Request $req){
        // Expect payload: date, course_id, attendances => [{ enroll_id, status }, ...]
        $data = $req->validate([
            'date' => 'required|date',
            'course_id' => 'required|integer',
            'attendances' => 'required|array',
            'attendances.*.enroll_id' => 'required|integer',
            'attendances.*.status' => 'required|in:P,A,L'
        ]);

        $created = 0;
        foreach ($req->attendances as $a) {
            $enroll = Enrollment::find($a['enroll_id']);
            if (!$enroll) continue;

            $attendanceData = [
                'enroll_id' => $a['enroll_id'],
                'markby' => Auth::user()->id,
                'status' => $a['status'],
                'date' => $req->date,
                'student_id' => $enroll->student_id,
                'course_id' => $enroll->course_id,
            ];

            // prevent duplicate for same enroll_id + date: update if exists, otherwise create
            $att = Attendance::updateOrCreate(
                ['enroll_id' => $a['enroll_id'], 'date' => $req->date],
                $attendanceData
            );

            if ($att) $created++;
        }

        return redirect()->back()->with('message', "Saved {$created} attendance records");
    }
    public function studentDashboard(){
        $users = User::all()->where('id',Auth::user()->id);
        
        return Inertia::render('StudentDashboard',['users'=>$users]);

    }
    public function adminDashboard(){
    
        $users = User::all()->where('role','!=','admin');
        $courses = Course::all();
        $enroll = Enrollment::all();
        return Inertia::render('AdminDashboard',['users'=>$users, 'courses'=> $courses, 'enrollments'=>$enroll]);

    }

    public function enrollStudent(Request $req){
        $data = $req->validate([
            'student_id' => 'required',
            'course_id' => 'required'
        ]);
        Enrollment::create($data);
        

        return redirect()->back();
    }
    public function addUser(Request $req){
        $req->validate([
            'name'=>'required',
            'email' => 'required|email|unique:users,email',
            'username'=>'required|unique:users,username',
            'password'=>'required|confirmed',
            'role'=>'required|in:student,teacher',
        ]);
        User::create([
            'name'=>$req->name,
            'email'=>$req->email,
            'username'=>$req->username,
            'password'=>$req->password,
            'role'=>$req->role,
        ]);

        return redirect()->back();
    }

    public function addcourse(Request $req){
        $data = $req->validate([
            'name' => 'required',
            'credits'=> 'required',
            'teacher_id' => 'required'
        ]);

        Course::create($data);

        return redirect()->back();
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
            return redirect()->back();
        }
    }

}
