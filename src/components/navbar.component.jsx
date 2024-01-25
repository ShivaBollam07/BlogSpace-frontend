import logo from "../imgs/logo.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component";


const Navbar = () => {

    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);

    const [userNavPanel, setUserNavPanel] = useState(false);

    const { userAuth } = useContext(UserContext);

    let navigate = useNavigate();

    const access_token = userAuth?.access_token;
    const profile_img = userAuth?.profile_img;

    const handleUserNavPanel = () => {
        setUserNavPanel(currentVal => !currentVal);
    }

    const handleSearch = (e) => {
        let query = e.target.value;


        if (e.keyCode === 13 && query.length) {
            navigate(`/search/${query}`);
        }

        if (e.keyCode === 8 && query.length === 1) {
            navigate(`/`);
        }



    }

    const handleBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false);
        }, 200);
    }


    return (

        <>
            <nav className="navbar z-50">


                <Link to="/" className="flex-none w-10">
                    <img src={logo} className="w-full" />
                </Link>

                <div className={"absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey  py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " + (searchBoxVisibility ? "show" : "hide")} >
                    <input type="text" placeholder="Search"
                        onKeyDown={handleSearch}
                        className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] ,md:pr-6 rounded-full placeholdetext-dark-grey md:pl-12" />
                    <i className="fi fi-rs-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-1xl text-dark-grey"></i>
                </div>

                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    <button className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center" onClick={() => setSearchBoxVisibility(currentVal => !currentVal)}>
                        <i className="fi fi-rr-search text-xl"></i>
                    </button>

                    <Link to="/editor" className="hidden md:flex  gap-2 link">
                        <i className="fi fi-rr-edit-alt text-xl"></i>
                        <p>write</p>
                    </Link>

                    {

                        access_token ?

                            <>
                                

                                <div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
                                    <button className="w-12 h-12 mt-1" >
                                        <img src={profile_img} className="h-full w-full rounded-full" />
                                    </button>

                                    {
                                        userNavPanel ? <UserNavigationPanel /> : null
                                    }

                                </div>


                            </>

                            :

                            <>
                                <Link className="btn-dark py-2 " to="/signin">
                                    Sign In
                                </Link>

                                <Link className="btn-light py-2 hidden md:block " to="/signup">
                                    Sign Up
                                </Link>
                            </>

                    }



                </div>
            </nav>

            <Outlet />
        </>
    )
}

export default Navbar;