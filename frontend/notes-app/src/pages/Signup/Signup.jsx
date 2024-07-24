import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
const Signup=()=>{
    const[name,setname]=useState("");
    const[email,setemail]=useState("");
    const[error,seterror]=useState("");
    const[password,setpassword]=useState("");
    const navigate=useNavigate();
    const handleSignup=async(e)=>{
        e.preventDefault();
        if(!name){
            seterror("Please enter your name");
        }
        if(!validateEmail(email)){
            seterror("Please enter a valid email id");
        }
        if(!password){
            seterror("Please enter the password");
        }
        seterror("");
        //signup api call
        try {
            const response = await axiosInstance.post("/create-account", {
              fullName:name,
              email: email,
              password: password,
            });
            if(response.data && response.data.error){
                seterror(response.data.message);
                return;
            }
            // Handle successful registration 
            if (response.data && response.data.accessToken) {
              localStorage.setItem("token", response.data.accessToken);
              navigate("/dashboard");
            }
          } catch (error) {
            // Handle error
            if (error.response && error.response.data && error.response.data.message) {
              seterror(error.response.data.message);
            } else {
              seterror("An unexpected error has occurred");
            }
          }
    }
    return (
        <>
          <Navbar/>
            <div className="flex items-center justify-center mt-20">
                <div className="w-96 border rounded bg-white px-7 py-14">
                    <form onSubmit={handleSignup}>
                        <h4 className="text-2xl mb-7">Signup</h4>
                        <input type="text" placeholder="Name" className="input-box"
                        value={name}
                        onChange={(e)=>setname(e.target.value)}
                        />
                         <input type="text" placeholder="Email" className="input-box"
                        value={email}
                        onChange={(e)=>setemail(e.target.value)}
                        />
                        <PasswordInput 
                        value={password}
                        onChange={(e)=>setpassword(e.target.value)}/>
                         {error&&<p className="text-red-500 text-xs pb-1">{error}</p>}
                        <button type="submit" className="btn-primary">Signup</button>
                        <p className="text-md text-center mt-4">
                            Already have an account?{" "}
                            <NavLink to="/login" className="font-medium text-primary underline">Login</NavLink>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}
export default Signup;