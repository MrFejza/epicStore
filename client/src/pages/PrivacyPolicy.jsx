import React from 'react';
import Header from '../components/Header';

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">Politika e Privatësisë</h1>
          <p className="mb-4 text-lg text-gray-700">
            Ne jemi të përkushtuar të mbrojmë privatësinë tuaj dhe të sigurojmë që informacioni juaj personal të
            trajtohet me kujdes dhe në përputhje me ligjet dhe rregulloret në fuqi. Kjo politikë privatësie
            përshkruan mënyrën sesi ne mbledhim, përdorim dhe ruajmë të dhënat tuaja.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">Mbledhja e Informacionit</h2>
          <p className="mb-4 text-gray-700">
            Ne mbledhim informacionin tuaj personal si emri, adresa e email-it, numri i telefonit, dhe adresa e dorëzimit
            kur vendosni një porosi ose regjistroni një llogari. Gjithashtu, mbledhim informacion jo-personal si adresën
            IP, llojin e shfletuesit dhe sjelljen e shfletimit për të përmirësuar shërbimet tona.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">Përdorimi i Informacionit</h2>
          <p className="mb-4 text-gray-700">
            Ne përdorim informacionin tuaj për të përpunuar porositë, për të dërguar konfirmime të porosive dhe për të
            dorëzuar produktet. Gjithashtu, mund të përdorim të dhënat tuaja për qëllime marketingu, por ju mund të
            zgjidhni të mos merrni emaile promovuese në çdo kohë.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">Ndërmjetësimi i Informacionit</h2>
          <p className="mb-4 text-gray-700">
            Ne mund të ndajmë informacionin tuaj me ofrues të shërbimeve të palëve të treta, si kompani transporti, për
            të përmbushur porositë. Nuk i shesim apo ndajmë të dhënat tuaja personale me palë të treta për qëllime marketingu pa pëlqimin tuaj.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">Cookies dhe Teknologji të Ngjashme</h2>
          <p className="mb-4 text-gray-700">
            Ne përdorim cookies për të ruajtur informacionin e sesionit, si artikujt në shportën tuaj të blerjes, dhe për
            të kuptuar sjelljen e përdoruesve për të përmirësuar faqen tonë. Ju mund t'i çaktivizoni cookies përmes
            cilësimeve të shfletuesit tuaj, por disa funksione të faqes mund të mos funksionojnë siç duhet.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">Siguria e të Dhënave</h2>
          <p className="mb-4 text-gray-700">
            Ne zbatojmë një sërë masash sigurie për të mbrojtur informacionin tuaj personal gjatë transaksioneve. 
            Megjithatë, asnjë metodë transmetimi mbi internet nuk është 100% e sigurt.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">Të Drejtat Tuaja</h2>
          <p className="mb-4 text-gray-700">
            Ju keni të drejtën të aksesoni, përditësoni ose fshini informacionin tuaj personal në çdo kohë duke hyrë në
            llogarinë tuaj ose duke na kontaktuar drejtpërdrejt. Nëse jeni në BE, keni të drejta shtesë sipas GDPR-së.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">Lidhjet me Palët e Treta</h2>
          <p className="mb-4 text-gray-700">
            Faqja jonë mund të përmbajë lidhje me faqe të palëve të treta. Ne nuk jemi përgjegjës për politikat e
            privatësisë apo praktikat e këtyre faqeve.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">Privatësia e Fëmijëve</h2>
          <p className="mb-4 text-gray-700">
            Shërbimet tona nuk janë të destinuara për individë nën moshën 13 vjeç. Ne nuk mbledhim qëllimisht informacion
            personal nga fëmijët.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">Ndryshimet në Politikë</h2>
          <p className="mb-4 text-gray-700">
            Ne rezervojmë të drejtën për të përditësuar këtë politikë privatësie. Çdo ndryshim do të postohet në këtë
            faqe dhe, nëse ndryshimet janë të rëndësishme, do t'ju njoftojmë përmes email-it ose faqes së internetit.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">Kontakti</h2>
          <p className="mb-4 text-gray-700">
            Nëse keni ndonjë pyetje në lidhje me këtë politikë privatësie ose sesi trajtohen të dhënat tuaja, na
            kontaktoni në: <a href="mailto:epicstore2020.info@gmail.com" className="text-violet-600">epicstore2020.info@gmail.com</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
