import HamburgerMenu from './HamburgerMenu'

export default function Navbar() {

    return(

        <div class="">
            <HamburgerMenu />
            
            <img src={localStorage.getItem('profilePicture')} alt=""/>

        </div>

    );

}