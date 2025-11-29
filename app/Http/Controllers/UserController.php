<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserController extends Controller
{

    public function teacherDashboard(){
        $users = User::all()->where('id',Auth::user()->id);
            
        return Inertia::render('TeacherDashboard',['users'=>$users]);
    
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
