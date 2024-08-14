"use client";

import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-row min-h-screen">
      <div className="bg-[#313131] hidden lg:flex lg:justify-center lg:items-center  lg:w-1/2">
        {" "}
        <Image
          src="chat-img.svg"
          width={500}
          height={500}
          alt="Imagem principal"
        />
      </div>
      <div className="bg-white w-screen flex justify-center items-center lg:w-1/2">
        <LoginForm />
      </div>
      
      {/* <div className="hero-content">
        <div className="card bg-base-100 min-w-80 shrink-0 shadow-2xl lg:min-w-96">
          <form onSubmit={handleSubmit} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div> */}
    </main>
  );
}
