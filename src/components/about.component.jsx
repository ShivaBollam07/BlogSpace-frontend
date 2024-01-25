import { Link } from "react-router-dom";
import getDay from "../common/date";

const AboutUser = ({ bio, social_links, joinedAt, className }) => {
    return (
        <div className={"items-center md:w-[90%] md:mt-7 " + className}>
           

            <div className="flex gap-x-7 gap-y-2 flex-wrap 
              my-7  text-dark-grey items-center">

                {

                    Object.keys(social_links).map((key) => {

                        let link = social_links[key];

                        return link ? <Link to={link} key={key}
                            target="_blank" >
                            <i className={"fi " + (key !== 'website' ? "fi-brands-" + key : "fir-rr-globe") + " text-xl hover:text-black"} ></i>
                        </Link> : null
                    })
                }
            </div>

            <p className="text-dark-grey text-xl leading-7 ">Joined on: {getDay(joinedAt)}</p>

        </div>
    )
}

export default AboutUser;