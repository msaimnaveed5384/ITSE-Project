<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{

    public function studentDashboard(){
        $users = User::all()->where('id',Auth::user()->id);
        
        return Inertia::render('StudentDashboard',['users'=>$users]);

    }
    public function Login(Request $req){
        $data = $req->validate([
            'username' => 'required',
            'password' => 'required'
        ]);
        $vari = "NOT";
        if(Auth::attempt($data)){
            if(Auth::user()->role == "admin"){

                return redirect('/dashboard/student');
            }
            else if(Auth::user()->role == "teacher"){
                return redirect('/dashboard');
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
