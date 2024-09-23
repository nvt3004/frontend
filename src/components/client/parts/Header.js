
import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import TopBar from '../header/DesktopTopBar';
import DesktopMenu from '../header/DesktopNAV';
import MobileHeader from '../header/MobileNAV';
import MobileMenu from '../header/MobileNavDetail';
import ModalSearch from '../header/ModalSearch';


const Header = () => {
  const [isModalSearchVisible, setModalSearchVisible] = useState(false);
  // const [isMenuMobileVisible, setMenuMobileVisible] = useState(false);

  const toggleModalSearch = () => setModalSearchVisible(!isModalSearchVisible);
  // const toggleMenuMobile = () => setMenuMobileVisible(!isMenuMobileVisible);

  return (
    <header>
      {/* Header desktop */}
      <div className="container-menu-desktop">
        <TopBar />
        <DesktopMenu />
        
      </div>

      {/* Header Mobile */}
      <MobileHeader />
      <MobileMenu />

      {/* Modal Search */}
      <ModalSearch isVisible={isModalSearchVisible} onClose={toggleModalSearch} />
    </header>
  );
};

export default Header;
