"use client";

import Image from "next/image";
import Header from "@/components/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [keywords, setKeywords] = useState("");
  const [subheadings, setSubheadings] = useState(5);
  const [words, setWords] = useState(800);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keywords) {
      router.push(`/blog?keywords=${encodeURIComponent(keywords)}&subheadings=${subheadings}&words=${words}`);
    }
  };

  return (
    <>
      <Header />
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Generate a Blog Post
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Enter your topic keywords, the number of subheadings, and the desired word count to generate a well-structured blog post.
            </p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="keywords" className="leading-7 text-sm text-gray-600">
                    Keywords
                  </label>
                  <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="subheadings" className="leading-7 text-sm text-gray-600">
                    Number of Subheadings
                  </label>
                  <input
                    type="number"
                    id="subheadings"
                    name="subheadings"
                    value={subheadings}
                    onChange={(e) => setSubheadings(e.target.value)}
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="words" className="leading-7 text-sm text-gray-600">
                    Word Count
                  </label>
                  <input
                    type="number"
                    id="words"
                    name="words"
                    value={words}
                    onChange={(e) => setWords(e.target.value)}
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

