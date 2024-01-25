import React, { useContext, useRef } from 'react';
import InputBox from '../components/input.component'
import googleIcon from '../imgs/google.png'
import { Link, Navigate } from 'react-router-dom';
import AnimationWrapper from '../common/page-animation';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { storeInSession } from '../common/session';
import { UserContext } from '../App';
import { authwithgoogle } from '../common/firebase';



const UserAuthForm = ({ type }) => {
    const { userAuth, setUserAuth } = useContext(UserContext);
    const access_token = userAuth?.access_token;
    
    console.log(access_token)


    const userAuthThroughServer = (serverRoute, formData) => {


        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute,
            formData)

            
            .then(({ data }) => {
                storeInSession("user", JSON.stringify(data));
                setUserAuth(data)

            })
            .catch((error) => {

                //staus code 404
                if (error.response.status === 404) {
                    return toast.error("User not found");
                }

                //status code 401
                if (error.response.status === 403) {
                    return toast.error("Invalid password");
                }




                toast.error(error.response.data.message);
            })
    }

    const handleSubmit = (e) => {

        e.preventDefault();

        let serverRoute = type === "sign-in" ? "/signin" : "/signup";

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;


        let form = new FormData(formElement);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { fullname, email, password } = formData;


        if (fullname) {
            if (fullname.length < 3) {
                return toast.error("Fullname must be atleast 3 characters long");
            }
        }

        if (!email || !password) {
            return toast.error("Please fill all the fields");
        }
        if (!emailRegex.test(email)) {
            return toast.error("Enter a valid email");
        }
        if (!passwordRegex.test(password)) {
            return toast.error("Password must be atleast 6 characters long and contain atleast one uppercase letter, one lowercase letter and one number");
        }






        userAuthThroughServer(serverRoute, formData);

    }

    const handleGoogleAuth = (e) => {
        e.preventDefault();
    
        authwithgoogle().then((user) => {
            let serverRoute = "/google-auth";
    
            let formData = {
                access_token: user.accessToken,
            }
    
            userAuthThroughServer(serverRoute, formData);
        })
        .catch((error) => {
            toast.error(error.message);
        });
    }
    




        return (
            access_token ?
                <Navigate to="/" /> :


                <AnimationWrapper keyValue={type}>
                    <section className="h-cover flex items-center justify-center">
                        <Toaster />
                        <form className="w-[80%] max-w-[400px]" id="formElement">
                            <h1 className="text-4xl font-gelasio capitalize mb-24 text-center">
                                {type === "sign-in" ? "Welcome back " : "Join Us today"}
                            </h1>

                            {
                                type != "sign-in" ?
                                    <InputBox
                                        name="fullname"
                                        type="text"
                                        placeholder="Full Name"
                                        icon="fi-rr-user"
                                    />
                                    : null
                            }

                            <InputBox
                                name="email"
                                type="email"
                                placeholder="Email"
                                icon="fi-rr-envelope"
                            />

                            <InputBox
                                name="password"
                                type="password"
                                placeholder="Password"
                                icon="fi-rr-key"
                            />

                            <button className="btn-dark center py-2 mt-4"
                                type="submit"
                                onClick={handleSubmit}
                            >
                                {type.replace("-", " ")}
                            </button>

                            <div className='relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold'>
                                <hr className='w-full border-1 border-black' />
                                <p className='absolute left-1/2 transform -translate-x-1/2 bg-white px-2'>or</p>
                                <hr className='w-full border-1 border-black' />
                            </div>

                            <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center' onClick={handleGoogleAuth}>
                                <img src={googleIcon} className='w-5' />
                                {type.replace("-", " ")} with Google
                            </button>

                            {
                                type === "sign-in" ?
                                    <p className="mt-6 text-dark-grey text-xl text-center" >
                                        Don't have an account ? &nbsp;
                                        <Link to="/signup" className='underline text-black text-xl m1-1'>
                                            Sign Up
                                        </Link>
                                    </p> :
                                    <p className="mt-6 text-dark-grey text-xl text-center" >
                                        Already have an account ? &nbsp;
                                        <Link to="/signin" className='underline text-black text-xl m1-1'>
                                            Sign In
                                        </Link>
                                    </p>
                            }

                        </form>
                    </section>
                </AnimationWrapper>
        )
    }

    export default UserAuthForm;