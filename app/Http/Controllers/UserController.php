<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function Login(Request $req){
        $data = $req->validate([
            'username' => 'required',
            'password' => 'required'
        ]);
        $vari = "NOT";
        if(Auth::attempt($data)){
            if(Auth::user()->role == "admin"){
                return redirect('/dashboard');
            }
            else if(Auth::user()->role == "teacher"){
                return redirect('/dashboard');
            }
            else if(Auth::user()->role == "student"){
                return redirect('/dashboard');
            }
        }
        

        
        

    }
}
