import React from 'react'

const LoginForm2 = () => {
  return (
    <div>
<div className="navbar bg-base-100">
  <a className="btn btn-ghost text-xl">Stafko</a>
</div>
      <div className="hero min-h-screen bg-base-200">
  <div className="hero-content flex-col lg:flex-row-reverse">
  <div className="flex flex-col items-center">
  <h1 className="text-5xl font-bold">¡Bienvenido a Stafko!</h1>
  <p className="py-6">Tu aplicación de confianza donde puedes guardar todos tus Proyectos</p>
</div>
    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
      <form className="card-body">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Usuario</span>
          </label>
          <input type="text" placeholder="Usuario" className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Contraseña</span>
          </label>
          <input type="password" placeholder="Contraseña" className="input input-bordered" required />
          <label className="label">
            <a href="#" className="label-text-alt link link-hover">¿Olvidaste la contraseña?</a>
            <a href="#" className="label-text-alt link link-hover">¿No tienes una cuenta?</a>
          </label>
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary">Iniciar Sesión</button>
        </div>
      </form>
    </div>
  </div>
</div>
<footer className="footer footer-center p-4 bg-base-300 text-base-content">
  <aside>
    <p>Copyright © 2024 - All right reserved by Fran Ortega Velasco</p>
  </aside>
</footer>
    </div>
  )
}

export default LoginForm2
