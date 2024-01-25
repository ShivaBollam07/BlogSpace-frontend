import { Link } from 'react-router-dom';
import pageNoFoundImage from '../imgs/404.png'
import fullLogo from '../imgs/full-logo.png'

const PageNotFound = () => {
    return (
        <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
            <img src={pageNoFoundImage} alt="404" className="select-none border-2 border-grey w-72 aspect-square object-cover rounded" />
            <h1 className="text-4xl font-gelasio leading-7">Page Not Found</h1>
            <p className="text-2xl font-gelasio leading-7 text-dark-grey -mt-8">The page you are looking for does not exist or has been removed. Head back to the  <Link to="/" className="text-black underline 
                hover:text-blue-dark transition duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-50 text-2xl

                ">Home</Link>
            </p>

            <div className='mt-auto'>
                <img src = {fullLogo} alt="logo" className=" h-8 object-contain black mx-auto select-none" />
                <p
                className='mt-5 text-dark-grey'
                >Read millions of stories around the world</p>

            </div>


        </section>
    )
};

export default PageNotFound;