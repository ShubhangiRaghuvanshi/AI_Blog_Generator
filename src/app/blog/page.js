"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="/" className="text-white text-3xl font-extrabold">BlogSite</a>
        <div>
          <a href="/" className="text-white hover:text-gray-300 px-6">Home</a>
          <a href="/about" className="text-white hover:text-gray-300 px-6">About</a>
        </div>
      </div>
    </nav>
  );
};

const Blog = () => {
  const params = useSearchParams();
  const topic = params.get("prompt"); // Fetch 'prompt' from URL
  const [blog, setBlog] = useState({ title: "", date: "", metadata: "", tags: "", content: "" });

  useEffect(() => {
    const fetchBlog = async () => {
      if (!topic) return; // Ensure 'topic' exists

      try {
        let response = await fetch(`/api/generate?prompt=${topic}`); // Fixed the URL parameter
        let data = await response.json(); // Parse the response JSON

        setBlog(data.blog); // Assuming the response has the blog data directly in 'data.blog'
      } catch (error) {
        console.error("Error fetching blog:", error);
        setBlog({ title: "Error", content: "Failed to fetch blog." }); // Error handling
      }
    };

    fetchBlog(); // Fetch blog data when topic changes

  }, [topic]); // Add 'topic' as dependency to re-fetch when it changes

  if (!blog.title) return <p className="text-center text-xl text-gray-700">Loading...</p>; // Show loading until blog is fetched

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 py-16">
        <article className="max-w-3xl mx-auto p-8 bg-white shadow-2xl rounded-lg mb-12">
          <h1 className="text-5xl font-extrabold text-blue-700 mb-8">{blog.title}</h1>
          <div className="text-gray-500 text-sm mb-8">{blog.metadata}</div>

          {/* Render Blog Content */}
          <div className="prose lg:prose-xl max-w-none mb-10" dangerouslySetInnerHTML={{ __html: blog.content }} />

          <div className="text-center mt-12">
            <a
              href="/"
              className="inline-block text-white bg-blue-600 hover:bg-blue-700 font-semibold py-4 px-10 rounded-lg shadow-md transition-all duration-300 ease-in-out"
            >
              Go Back to Home
            </a>
          </div>
        </article>
      </main>
    </>
  );
};

export default Blog;

