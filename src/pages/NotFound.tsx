import { BiSolidErrorCircle } from "react-icons/bi"

const NotFound = () => {
    return (
        <div>
            <div className="container notfound">
                <BiSolidErrorCircle />
                <h1>Page Not Found</h1>
            </div>
        </div>
    )
}

export default NotFound
