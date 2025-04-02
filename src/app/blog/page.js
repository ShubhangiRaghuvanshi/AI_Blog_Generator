"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 p-5 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="/" className="text-white text-4xl font-extrabold tracking-wide">BlogSite</a>
        <div>
          <a href="/" className="text-gray-300 hover:text-white px-6 text-lg font-medium">Home</a>
          <a href="/about" className="text-gray-300 hover:text-white px-6 text-lg font-medium">About</a>
        </div>
      </div>
    </nav>
  );
};

const Blog = () => {
  const params = useSearchParams();
  const keywords = params.get("keywords");
  const subheadings = params.get("subheadings") || 5;
  const words = params.get("words") || 800;
  const [blog, setBlog] = useState({ title: "", metadata: "", content: "", image: "" });

  useEffect(() => {
    const fetchBlog = async () => {
      if (!keywords) return;

      try {
        let response = await fetch(
          `/api/generate?keywords=${keywords}&subheadings=${subheadings}&words=${words}`
        );
        let data = await response.json();
        setBlog(data.blog);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setBlog({ title: "Error", content: "Failed to fetch blog." });
      }
    };

    fetchBlog();
  }, [keywords, subheadings, words]);

  if (!blog.title) return <p className="text-center text-2xl text-gray-700 mt-16">Loading...</p>;

  const contentSections = blog.content.split(/- (.+)/g).filter(Boolean);
  
  return (
    <>
      <Navbar />
      <main className="bg-gray-100 py-16 font-[\'Times_New_Roman\']">
        <article className="max-w-4xl mx-auto p-10 bg-white shadow-xl rounded-2xl mb-12">
          <h1 className="text-6xl font-extrabold text-gray-900 mb-6 text-center leading-tight">{blog.title}</h1>
          <p className="text-gray-500 text-lg italic mb-8 text-center">{blog.metadata}</p>
          {blog.image && (
            <img src={blog.image} alt={blog.title} className="w-full rounded-xl shadow-md mb-8 object-cover max-h-[500px]" />
          )}
          <div className="prose lg:prose-xl max-w-none mb-10 leading-relaxed text-gray-800">
            {contentSections.map((section, index) => (
              index % 2 === 0 ? (
                <h2 key={index} className="text-4xl font-bold mt-10 mb-5 text-gray-900 border-l-4 border-gray-600 pl-4">{section}</h2>
              ) : (
                <p key={index} className="mb-6 text-lg leading-8">{section}</p>
              )
            ))}
          </div>
          <div className="text-center mt-16">
            <a href="/" className="inline-block text-white bg-gray-800 hover:bg-gray-900 font-semibold py-4 px-12 rounded-xl shadow-lg text-lg transition-all duration-300 ease-in-out">
              Go Back to Home
            </a>
          </div>
        </article>
      </main>
    </>
  );
};

export default Blog;




