import React from "react";
import NavbarContact from "./NavbarContact";
import Footer from "../FooterComponent/Footer";

const AboutContact = () => {
  return (
    <div>
      <NavbarContact />
      <div className="about">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 px-4 lg:px-8 py-12">
          <div className="bg-transparent p-6">
            <h2 className="text-2xl font-semibold mb-4">Acerca de</h2>
            <p className="text-lg">
              Bienvenido a mi aplicación de gestión de proyectos, creada durante
              el periodo de prácticas en BeeBit en 2024. Esta aplicación te
              permite administrar proyectos de manera eficiente, colaborar con
              tu equipo, y gestionar el tiempo con la integración de Clockify.
            </p>
            <p className="text-lg mt-4">Funcionalidades destacadas:</p>
            <ul className="list-disc ml-6 text-lg">
              <li>Registro de usuarios y autenticación segura.</li>
              <li>Subida y gestión de proyectos.</li>
              <li>Integración con la API de Clockify para registrar tiempo.</li>
              <li>
                Posibilidad de añadir colaboradores y clientes a proyectos.
              </li>
            </ul>
          </div>
          <div className="bg-transparent p-6 ">
            <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
            <p className="text-lg">
              Si tienes alguna pregunta, sugerencia o simplemente deseas ponerte
              en contacto, no dudes en hacerlo a través de los siguientes
              medios:
            </p>
            <p className="text-lg mt-4">
              Correo electrónico:{" "}
              <a href="mailto:fvfotura@gmail.com">fvfotura@gmail.com</a>
            </p>
            <p className="text-lg mt-4">Repositorios de GitHub:</p>
            <ul className="list-disc ml-6 text-lg">
              <li>
                {" "}
                <a className="link" href="https://github.com/Frorve/Front">
                  Frontend{" "}
                </a>
              </li>
              <li>
                {" "}
                <a className="link" href="https://github.com/Frorve/Back">
                  Backend{" "}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutContact;
