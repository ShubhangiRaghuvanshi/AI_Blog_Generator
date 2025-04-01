"use client";

import Image from "next/image";
import Header from "@/components/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setPrompt(e.target.value); // Update state when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on submit
    if (prompt) {
      router.push("/blog?prompt="+prompt); // Properly encode the prompt
    }
  };

  return (
    <>
      <Header />
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Enter your Topic
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Whatever your topic, we can help you generate a blog post that is
              informative, engaging, and tailored to your audience. Just enter your
              topic and let our AI do the rest!
            </p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="topic" className="leading-7 text-sm text-gray-600">
                    Topic
                  </label>
                  <input
                    type="text"
                    id="prompt"
                    name="prompt"
                    value={prompt}
                    onChange={handleChange}
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full text-center">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Generate Blog
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
