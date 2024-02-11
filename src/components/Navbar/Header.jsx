import React from 'react';
import { BsFillEnvelopeFill, BsJustify } from 'react-icons/bs';
import { CiGlobe } from 'react-icons/ci';
import { FaInstagram } from 'react-icons/fa';
import { RxDiscordLogo } from 'react-icons/rx';

function Header({ OpenSidebar }) {
  return (
    <header className='header'>
      <div className='menu-icon'>
        <BsJustify className='icon' onClick={OpenSidebar} />
      </div>
      <div className='header-left'>
        <a href='https://plasticque.id' target='_blank' rel='noreferrer'>
          <CiGlobe className='icon' />
        </a>
      </div>
      <div className='header-right'>
        <a href='https://webmail.plasticque.id' target='_blank' rel='noreferrer'>
          <BsFillEnvelopeFill className='icon' />
        </a>
        <a href='https://www.instagram.com/plasticque.id?igsh=MWM0NDcwanhheXN0dA==' target='_blank' rel='noreferrer'>
          <FaInstagram className='icon' />
        </a>
        <a href='https://discord.gg/plasticque-unityindiversity-1088356545613537280#' target='_blank' rel='noreferrer'>
          <RxDiscordLogo className='icon' />
        </a>
      </div>
    </header>
  );
}

export default Header;
