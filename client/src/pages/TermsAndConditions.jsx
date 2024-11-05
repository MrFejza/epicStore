import React from 'react';
import Header from '../components/Header';

const TermsAndConditions = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">Kushtet e Përdorimit</h1>

          <p className="mb-4 text-lg text-gray-700">
            Duke përdorur faqen tonë të internetit, ju pranoni kushtet dhe rregullat e përcaktuara më poshtë. Ju lutemi lexoni me kujdes përpara se të vazhdoni përdorimin e shërbimeve tona.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">1. Llogaritë e Përdoruesit</h2>
          <p className="mb-4 text-gray-700">
            Për të bërë një porosi, ju mund të krijoni një llogari në faqen tonë. Ju jeni përgjegjës për të siguruar që informacioni që jepni është i saktë dhe i përditësuar. Jeni gjithashtu përgjegjës për sigurinë e llogarisë tuaj dhe çdo aktivitet që kryhet përmes saj.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">2. Porositë dhe Pagesat</h2>
          <p className="mb-4 text-gray-700">
            Të gjitha çmimet e produkteve tona janë të shprehura në lekë. Pagesa bëhet në dorëzim, dhe ne rezervojmë të drejtën për të refuzuar ose anuluar një porosi nëse produkti nuk është i disponueshëm.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">3. Transporti dhe Dorëzimi</h2>
          <p className="mb-4 text-gray-700">
            Ne ofrojmë dërgesë brenda Shqipërisë dhe Kosovës. Afatet e dorëzimit janë zakonisht nga 1 deri në 3 ditë pune. Tarifën e transportit mund ta gjeni në faqen tonë të internetit gjatë përfundimit të porosisë.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">4. Kthimet dhe Rimbursimet</h2>
          <p className="mb-4 text-gray-700">
            Ju mund të ktheni produktin brenda 48 orëve nga momenti i dorëzimit nëse është i papërdorur dhe në paketimin e tij origjinal. Rimbursimet do të përpunohen pasi produkti të ketë arritur dhe të jetë verifikuar. Ju lutemi të kontaktoni shërbimin tonë të klientit për të iniciuar një kthim.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">5. Pronësia Intelektuale</h2>
          <p className="mb-4 text-gray-700">
            Të gjitha materialet në këtë faqe, duke përfshirë tekstin, imazhet dhe dizajnin, janë pronë e Epic Store dhe janë të mbrojtura nga ligjet e pronës intelektuale. Përdorimi i paautorizuar i materialeve tona është i ndaluar.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">6. Aktivitetet e Ndaluara</h2>
          <p className="mb-4 text-gray-700">
            Ndalohet përdorimi i faqes sonë për aktivitete të paligjshme, për të përhapur virusë, apo për të shkelur sigurinë e faqes ose të përdoruesve të tjerë. Çdo abuzim do të rezultojë në heqjen e aksesit në llogarinë tuaj.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">7. Kufizimi i Përgjegjësisë</h2>
          <p className="mb-4 text-gray-700">
            Epic Store nuk do të jetë përgjegjës për ndonjë dëm të drejtpërdrejtë ose të tërthortë që rezulton nga përdorimi i shërbimeve tona, duke përfshirë vonesat, gabimet, apo humbjet financiare.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">8. Ndryshimet në Kushtet e Përdorimit</h2>
          <p className="mb-4 text-gray-700">
            Ne rezervojmë të drejtën për të përditësuar këto kushte në çdo kohë. Ndryshimet do të postohen në këtë faqe, dhe nëse janë të rëndësishme, do t'ju njoftojmë përmes email-it ose faqes sonë të internetit.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">9. Ligji Përkatës</h2>
          <p className="mb-4 text-gray-700">
            Këto kushte janë të rregulluara dhe interpretuara në përputhje me ligjet e Republikës së Shqipërisë.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-800">10. Kontakti</h2>
          <p className="mb-4 text-gray-700">
            Nëse keni ndonjë pyetje në lidhje me këto kushte, ju lutemi na kontaktoni në: <a href="mailto:epicstore2020.info@gmail.com" className="text-violet-600">epicstore2020.info@gmail.com</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
