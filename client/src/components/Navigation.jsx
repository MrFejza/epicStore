// src/components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ expanded, setExpanded, navHeight }) => {
  return (
    <div
      className={`col-span-2 lg:col-span-2 md:col-span-4 bg-violet-100 p-4 hidden sm:block hide-scrollbar`}
      style={{ height: expanded ? navHeight : 'auto', overflowY: expanded ? 'auto' : 'hidden' }}
    >
      <ul className="space-y-5 text-center overflow-auto hide-scrollbar">
        <li className="relative group">
          <Link to="/kategori/new" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Të Rejat</Link>
        </li>
        <li className="relative group">
          <Link to="/kategori/offers" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Oferta</Link>
        </li>
        <li className="relative group">
          <Link to="/kategori/ProduktePerFemije" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Produkte për Fëmijë</Link>
        </li>
        <li className="relative group">
          <Link to="/kategori/ElektronikeAksesore" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Elektronikë dhe Aksesorë</Link>
        </li>
        <li className="relative group">
          <Link to="/kategori/ShtepiJetese" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Shtëpi dhe Jetesë</Link>
        </li>
        <li className="relative group">
          <Link to="/kategori/ZyreTeknologji" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Zyrë dhe Teknologji</Link>
        </li>
        <li className="relative group">
          <Link to="/kategori/SportAktivitet" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Sport dhe Aktivitete</Link>
        </li>
        {expanded && (
          <>
            <li className="relative group">
              <Link to="/kategori/KuzhineUshqim" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Kuzhinë dhe Ushqim</Link>
            </li>
            <li className="relative group">
              <Link to="/kategori/FestaEvente" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Festa dhe Evente</Link>
            </li>
            <li className="relative group">
              <Link to="/kategori/Motorra" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Motorra</Link>
            </li>
            <li className="relative group">
              <Link to="/kategori/Kafshe" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Kafshë</Link>
            </li>
            <li className="relative group">
              <Link to="/kategori/all" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Të Gjitha</Link>
            </li>
          </>
        )}
        <li>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-violet-600 hover:text-violet-800"
          >
            {expanded ? 'Shfaq më pak' : 'Shfaq më shumë'}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
