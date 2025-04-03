"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";

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

const BlogContent = () => {
  const params = useSearchParams();
  const keywords = params.get("keywords") || "";
  const subheadings = parseInt(params.get("subheadings"), 10) || 5;
  const words = parseInt(params.get("words"), 10) || 800;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!keywords.trim()) {
        setError("No keywords provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/generate?keywords=${encodeURIComponent(keywords)}&subheadings=${subheadings}&words=${words}`
        );

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("🔍 API Response:", data);

        if (data.blog && Array.isArray(data.blog.sections)) {
          setBlog({
            title: data.blog.title || "Generated Blog",
            metadata: data.blog.metadata || "No metadata available",
            sections: data.blog.sections.length ? data.blog.sections : [],
          });
        } else {
          setBlog({ title: "Generated Blog", metadata: "", sections: [] });
          setError("No content available.");
        }
      } catch (error) {
        console.error("❌ Error fetching blog:", error);
        setError("Failed to fetch blog content.");
        setBlog(null);
      }
      setLoading(false);
    };

    fetchBlog();
  }, [keywords, subheadings, words]);

  if (loading) {
    return <p className="text-center text-2xl text-gray-700 mt-16">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-2xl text-gray-700 mt-16">{error}</p>;
  }

  return (
    <main className="bg-gray-100 py-16">
      <article className="max-w-4xl mx-auto p-10 bg-white shadow-xl rounded-2xl mb-12">
        {/* Blog Title */}
        <h1 className="text-6xl font-extrabold text-gray-900 mb-6 text-center leading-tight font-serif">
          {blog?.title || "Untitled Blog"}
        </h1>
        <p className="text-gray-500 text-lg italic mb-8 text-center font-serif">
          {blog?.metadata || "No metadata available"}
        </p>

        {/* Blog Sections */}
        <div className="prose lg:prose-xl max-w-none mb-10 leading-relaxed text-gray-800 font-serif">
          {blog?.sections.length > 0 ? (
            blog.sections.map((section, index) => (
              <div key={index} className="mb-10">
                {/* Image */}
                {section.image && (
                  <img
                    src={section.image}
                    alt={section.subheading}
                    loading="lazy"
                    className="w-full rounded-xl shadow-md mb-4 object-cover max-h-[300px]"
                  />
                )}

                {/* Subheading */}
                <h2 className="text-4xl font-bold mt-6 mb-4 text-gray-900 border-l-4 border-gray-600 pl-4 font-serif">
                  {section.subheading || "Untitled Section"}
                </h2>

                {/* Paragraph Content */}
                <p className="text-lg leading-8 font-serif">
                  {section.content || "No content available."}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-xl text-gray-600">No content available.</p>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center mt-16">
          <Link
            href="/"
            className="inline-block text-white bg-gray-800 hover:bg-gray-900 font-semibold py-4 px-12 rounded-xl shadow-lg text-lg transition-all duration-300 ease-in-out"
          >
            Go Back to Home
          </Link>
        </div>
      </article>
    </main>
  );
};

const Blog = () => {
  return (
    <>
      <Navbar />
      <Suspense fallback={<p className="text-center text-2xl text-gray-700 mt-16">Loading...</p>}>
        <BlogContent />
      </Suspense>
    </>
  );
};

export default Blog;
