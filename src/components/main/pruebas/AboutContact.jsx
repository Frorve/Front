import React, { useState, useEffect } from "react";
import "../MainPage.css";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const AboutContact = () => {
  const { username } = useParams();

  return (
    <div>
      <Navbar
        username={username}
      />
      <div className="wrapper-main">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 lg:px-8 py-12">
       <div className="bg-white p-6 rounded-lg shadow-md">
         <h2 className="text-2xl font-semibold mb-4">Acerca de</h2>
         <p className="text-lg">
           Esta es una página web dedicada a la gestión de proyectos.
         </p>
       </div>
       <div className="bg-white p-6 rounded-lg shadow-md">
         <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
         <p className="text-lg">
           Si tienes alguna pregunta o sugerencia, no dudes en ponerte en
           contacto con nosotros.
         </p>
         <p className="text-lg">Correo electrónico: contacto@example.com</p>
         <p className="text-lg">Teléfono: +1234567890</p>
       </div>
     </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutContact;





// import React from "react";

// const AboutContact = () => {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 lg:px-8 py-12">
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-2xl font-semibold mb-4">Acerca de</h2>
//         <p className="text-lg">
//           Esta es una página web dedicada a la gestión de proyectos. Lorem ipsum
//           dolor sit amet, consectetur adipiscing elit. Nullam scelerisque quam
//           et eros congue, nec volutpat orci pharetra. Fusce nec eros nec nisi
//           vulputate venenatis.
//         </p>
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
//         <p className="text-lg">
//           Si tienes alguna pregunta o sugerencia, no dudes en ponerte en
//           contacto con nosotros.
//         </p>
//         <p className="text-lg">Correo electrónico: contacto@example.com</p>
//         <p className="text-lg">Teléfono: +1234567890</p>
//       </div>
//     </div>
//   );
// };

// export default AboutContact;
