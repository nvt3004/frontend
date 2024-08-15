import React from "react";
import { Link } from "react-router-dom";
const Blog = () => {
  return (
    <div style={{marginTop:"80px"}}>
      {/* <!-- Title page --> */}
      <section
        class="bg-img1 txt-center p-lr-15 p-tb-92"
        style={{ backgroundImage: "url('images/bg-02.jpg')" }}
      >
        <h2 class="ltext-105 cl0 txt-center">Blog</h2>
      </section>

      {/* <!-- Content page --> */}
      <section class="bg0 p-t-62 p-b-60">
        <div class="container">
          <div class="row">
            <div class="col-md-8 col-lg-9 p-b-80">
              <div class="p-r-45 p-r-0-lg">
                {/* <!-- item blog --> */}
                <div class="p-b-63">
                  <a href="blog-detail.html" class="hov-img0 how-pos5-parent">
                    <img src="images/blog-04.jpg" alt="IMG-BLOG" />

                    <div class="flex-col-c-m size-123 bg9 how-pos5">
                      <span class="ltext-107 cl2 txt-center">22</span>

                      <span class="stext-109 cl3 txt-center">Jan 2018</span>
                    </div>
                  </a>

                  <div class="p-t-32">
                    <h4 class="p-b-15">
                      <a
                        href="blog-detail.html"
                        class="ltext-108 cl2 hov-cl1 trans-04"
                      >
                        8 Inspiring Ways to Wear Dresses in the Winter
                      </a>
                    </h4>

                    <p class="stext-117 cl6">
                      Class aptent taciti sociosqu ad litora torquent per
                      conubia nostra, per inceptos himenaeos. Fusce eget dictum
                      tortor. Donec dictum vitae sapien eu varius
                    </p>

                    <div class="flex-w flex-sb-m p-t-18">
                      <span class="flex-w flex-m stext-111 cl2 p-r-30 m-tb-10">
                        <span>
                          <span class="cl4">By</span> Admin
                          <span class="cl12 m-l-4 m-r-6">|</span>
                        </span>

                        <span>
                          StreetStyle, Fashion, Couple
                          <span class="cl12 m-l-4 m-r-6">|</span>
                        </span>

                        <span>8 Comments</span>
                      </span>

                       <Link
                        to="/blog-detail"
                        class="stext-101 cl2 hov-cl1 trans-04 m-tb-10"
                      >
                        Continue Reading
                        <i class="fa fa-long-arrow-right m-l-9"></i>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* <!-- item blog --> */}
                <div class="p-b-63">
                  <a href="blog-detail.html" class="hov-img0 how-pos5-parent">
                    <img src="images/blog-05.jpg" alt="IMG-BLOG" />

                    <div class="flex-col-c-m size-123 bg9 how-pos5">
                      <span class="ltext-107 cl2 txt-center">18</span>

                      <span class="stext-109 cl3 txt-center">Jan 2018</span>
                    </div>
                  </a>

                  <div class="p-t-32">
                    <h4 class="p-b-15">
                      <a
                        href="blog-detail.html"
                        class="ltext-108 cl2 hov-cl1 trans-04"
                      >
                        The Great Big List of Men’s Gifts for the Holidays
                      </a>
                    </h4>

                    <p class="stext-117 cl6">
                      Class aptent taciti sociosqu ad litora torquent per
                      conubia nostra, per inceptos himenaeos. Fusce eget dictum
                      tortor. Donec dictum vitae sapien eu varius
                    </p>

                    <div class="flex-w flex-sb-m p-t-18">
                      <span class="flex-w flex-m stext-111 cl2 p-r-30 m-tb-10">
                        <span>
                          <span class="cl4">By</span> Admin
                          <span class="cl12 m-l-4 m-r-6">|</span>
                        </span>

                        <span>
                          StreetStyle, Fashion, Couple
                          <span class="cl12 m-l-4 m-r-6">|</span>
                        </span>

                        <span>8 Comments</span>
                      </span>

                      <Link
                        to="/blog-detail"
                        class="stext-101 cl2 hov-cl1 trans-04 m-tb-10"
                      >
                        Continue Reading
                        <i class="fa fa-long-arrow-right m-l-9"></i>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* <!-- item blog --> */}
                <div class="p-b-63">
                  <a href="blog-detail.html" class="hov-img0 how-pos5-parent">
                    <img src="images/blog-06.jpg" alt="IMG-BLOG" />

                    <div class="flex-col-c-m size-123 bg9 how-pos5">
                      <span class="ltext-107 cl2 txt-center">16</span>

                      <span class="stext-109 cl3 txt-center">Jan 2018</span>
                    </div>
                  </a>

                  <div class="p-t-32">
                    <h4 class="p-b-15">
                      <a
                        href="blog-detail.html"
                        class="ltext-108 cl2 hov-cl1 trans-04"
                      >
                        5 Winter-to-Spring Fashion Trends to Try Now
                      </a>
                    </h4>

                    <p class="stext-117 cl6">
                      Class aptent taciti sociosqu ad litora torquent per
                      conubia nostra, per inceptos himenaeos. Fusce eget dictum
                      tortor. Donec dictum vitae sapien eu varius
                    </p>

                    <div class="flex-w flex-sb-m p-t-18">
                      <span class="flex-w flex-m stext-111 cl2 p-r-30 m-tb-10">
                        <span>
                          <span class="cl4">By</span> Admin
                          <span class="cl12 m-l-4 m-r-6">|</span>
                        </span>

                        <span>
                          StreetStyle, Fashion, Couple
                          <span class="cl12 m-l-4 m-r-6">|</span>
                        </span>

                        <span>8 Comments</span>
                      </span>

                     <Link
                        to="/blog-detail"
                        class="stext-101 cl2 hov-cl1 trans-04 m-tb-10"
                      >
                        Continue Reading
                        <i class="fa fa-long-arrow-right m-l-9"></i>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* <!-- Pagination --> */}
                <div class="flex-l-m flex-w w-full p-t-10 m-lr--7">
                  <Link
                    href="#"
                    class="flex-c-m how-pagination1 trans-04 m-all-7 active-pagination1"
                  >
                    1
                  </Link>

                  <Link href="#" class="flex-c-m how-pagination1 trans-04 m-all-7">
                    2
                  </Link>
                </div>
              </div>
            </div>

            <div class="col-md-4 col-lg-3 p-b-80">
              <div class="side-menu">
                <div class="bor17 of-hidden pos-relative">
                  <input
                    class="stext-103 cl2 plh4 size-116 p-l-28 p-r-55"
                    type="text"
                    name="search"
                    placeholder="Search"
                  />

                  <button class="flex-c-m size-122 ab-t-r fs-18 cl4 hov-cl1 trans-04">
                    <i class="zmdi zmdi-search"></i>
                  </button>
                </div>

                <div class="p-t-55">
                  <h4 class="mtext-112 cl2 p-b-33">Categories</h4>

                  <ul>
                    <li class="bor18">
                      <Link
                        href="#"
                        class="dis-block stext-115 cl6 hov-cl1 trans-04 p-tb-8 p-lr-4"
                      >
                        Fashion
                      </Link>
                    </li>

                    <li class="bor18">
                      <Link
                        href="#"
                        class="dis-block stext-115 cl6 hov-cl1 trans-04 p-tb-8 p-lr-4"
                      >
                        Beauty
                      </Link>
                    </li>

                    <li class="bor18">
                      <Link
                        href="#"
                        class="dis-block stext-115 cl6 hov-cl1 trans-04 p-tb-8 p-lr-4"
                      >
                        Street Style
                      </Link>
                    </li>

                    <li class="bor18">
                      <Link
                        href="#"
                        class="dis-block stext-115 cl6 hov-cl1 trans-04 p-tb-8 p-lr-4"
                      >
                        Life Style
                      </Link>
                    </li>

                    <li class="bor18">
                      <Link
                        href="#"
                        class="dis-block stext-115 cl6 hov-cl1 trans-04 p-tb-8 p-lr-4"
                      >
                        DIY & Crafts
                      </Link>
                    </li>
                  </ul>
                </div>

                <div class="p-t-65">
                  <h4 class="mtext-112 cl2 p-b-33">Featured Products</h4>

                  <ul>
                    <li class="flex-w flex-t p-b-30">
                      <Link
                        href="#"
                        class="wrao-pic-w size-214 hov-ovelay1 m-r-20"
                      >
                        <img src="images/product-min-01.jpg" alt="PRODUCT" />
                      </Link>

                      <div class="size-215 flex-col-t p-t-8">
                        <Link href="#" class="stext-116 cl8 hov-cl1 trans-04">
                          White Shirt With Pleat Detail Back
                        </Link>

                        <span class="stext-116 cl6 p-t-20">$19.00</span>
                      </div>
                    </li>

                    <li class="flex-w flex-t p-b-30">
                      <Link
                        href="#"
                        class="wrao-pic-w size-214 hov-ovelay1 m-r-20"
                      >
                        <img src="images/product-min-02.jpg" alt="PRODUCT" />
                      </Link>

                      <div class="size-215 flex-col-t p-t-8">
                        <Link href="#" class="stext-116 cl8 hov-cl1 trans-04">
                          Converse All Star Hi Black Canvas
                        </Link>

                        <span class="stext-116 cl6 p-t-20">$39.00</span>
                      </div>
                    </li>

                    <li class="flex-w flex-t p-b-30">
                      <Link
                        href="#"
                        class="wrao-pic-w size-214 hov-ovelay1 m-r-20"
                      >
                        <img src="images/product-min-03.jpg" alt="PRODUCT" />
                      </Link>

                      <div class="size-215 flex-col-t p-t-8">
                        <Link href="#" class="stext-116 cl8 hov-cl1 trans-04">
                          Nixon Porter Leather Watch In Tan
                        </Link>

                        <span class="stext-116 cl6 p-t-20">$17.00</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div class="p-t-55">
                  <h4 class="mtext-112 cl2 p-b-20">Archive</h4>

                  <ul>
                    <li class="p-b-7">
                      <Link
                        href="#"
                        class="flex-w flex-sb-m stext-115 cl6 hov-cl1 trans-04 p-tb-2"
                      >
                        <span>July 2018</span>

                        <span>(9)</span>
                      </Link>
                    </li>

                    <li class="p-b-7">
                      <Link
                        href="#"
                        class="flex-w flex-sb-m stext-115 cl6 hov-cl1 trans-04 p-tb-2"
                      >
                        <span>June 2018</span>

                        <span>(39)</span>
                      </Link>
                    </li>

                    <li class="p-b-7">
                      <Link
                        href="#"
                        class="flex-w flex-sb-m stext-115 cl6 hov-cl1 trans-04 p-tb-2"
                      >
                        <span>May 2018</span>

                        <span>(29)</span>
                      </Link>
                    </li>

                    <li class="p-b-7">
                      <Link
                        href="#"
                        class="flex-w flex-sb-m stext-115 cl6 hov-cl1 trans-04 p-tb-2"
                      >
                        <span>April 2018</span>

                        <span>(35)</span>
                      </Link>
                    </li>

                    <li class="p-b-7">
                      <Link
                        href="#"
                        class="flex-w flex-sb-m stext-115 cl6 hov-cl1 trans-04 p-tb-2"
                      >
                        <span>March 2018</span>

                        <span>(22)</span>
                      </Link>
                    </li>

                    <li class="p-b-7">
                      <Link
                        href="#"
                        class="flex-w flex-sb-m stext-115 cl6 hov-cl1 trans-04 p-tb-2"
                      >
                        <span>February 2018</span>

                        <span>(32)</span>
                      </Link>
                    </li>

                    <li class="p-b-7">
                      <Link
                        href="#"
                        class="flex-w flex-sb-m stext-115 cl6 hov-cl1 trans-04 p-tb-2"
                      >
                        <span>January 2018</span>

                        <span>(21)</span>
                      </Link>
                    </li>

                    <li class="p-b-7">
                      <Link
                        href="#"
                        class="flex-w flex-sb-m stext-115 cl6 hov-cl1 trans-04 p-tb-2"
                      >
                        <span>December 2017</span>

                        <span>(26)</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div class="p-t-50">
                  <h4 class="mtext-112 cl2 p-b-27">Tags</h4>

                  <div class="flex-w m-r--5">
                    <Link
                      href="#"
                      class="flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5"
                    >
                      Fashion
                    </Link>

                    <Link
                      href="#"
                      class="flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5"
                    >
                      Lifestyle
                    </Link>

                    <Link
                      href="#"
                      class="flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5"
                    >
                      Denim
                    </Link>

                    <Link
                      href="#"
                      class="flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5"
                    >
                      Streetstyle
                    </Link>

                    <Link
                      href="#"
                      class="flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5"
                    >
                      Crafts
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Blog;
