import { useState } from 'react';
import Header from '../components/Header';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'Si mund të bëj porosi?',
      answer: 'Ju mund të bëni porosi duke zgjedhur produktin e dëshiruar, shtuar atë në shportë dhe ndjekur hapat për të plotësuar të dhënat e dorëzimit dhe pagesës, ose duke na kontaktuar në rrjetet tona sociale si Instagram, Facebook, dhe TikTok, si dhe në WhatsApp në numrin +355 68 368 7387.'
    },
    {
      question: 'Për sa kohë më vjen porosia?',
      answer: 'Porosia juaj zakonisht mbërrin brenda 1-3 ditë, në varësi të lokacionit tuaj.'
    },
    {
      question: 'Sa kushton transporti?',
      answer: 'Transporti kushton 200 lek në Tiranë dhe 300 lek në rrethe për pako deri në 5 kg.'
    },
    {
      question: 'A mund të bëj pagesë me kartë krediti?',
      answer: 'Po, ne pranojmë pagesa me kartë krediti dhe debitit në platformën tonë.'
    },
    {
      question: 'Çfarë mënyra pagesash ofroni?',
      answer: 'Ne ofrojmë pagesa me kartë krediti/debiti, transfertë bankare, dhe pagesë në dorëzim.'
    },
    {
      question: 'Deri në çfarë ore punoni?',
      answer: 'Jemi në dispozicion për të marrë porosi 24/7 në platformën tonë online.'
    }
  ];

  return (
    <>
    <Header />
     <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Pyetjet e Shpeshta</h2>
      {faqs.map((faq, index) => (
        <div key={index} className="mb-4">
          <button
            onClick={() => toggleQuestion(index)}
            className="w-full text-left p-4 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            <span className="text-lg font-semibold">{faq.question}</span>
            <span className="float-right">{openIndex === index ? '-' : '+'}</span>
          </button>
          {openIndex === index && (
            <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
    </>
   
  );
};

export default FAQs;
