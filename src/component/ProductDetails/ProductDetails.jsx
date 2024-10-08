import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./ProductDetails.module.css"; // Assuming you have custom styles for buttons and other elements
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { api } from "../../API";
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart, fetchAllCart } from "../../features/cartSlice";
import {
  addProductToWishlist,
  fetchAllWishlist,
  removeProductFromWishlist,
} from "../../features/wishlistSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false); // Toggle state for showing details
  const [size, setsize] = useState(false); // Toggle state for showing details
  const [deviceType, setDeviceType] = useState("Desktop");
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const [isFav, setIsFav] = useState(false);
  const [isReq, setIsReq] = useState(false);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(
        `https://api.bantayga.wtf/api/products/${id}/`
      );
      console.log(data); // Print the response in the console
      setProduct(data); // Set the product data
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [id]);
  useEffect(() => {
    dispatch(fetchAllWishlist());
  }, [dispatch]);

  useEffect(() => {
    setIsFav(wishlist.find((item) => item.product.id == id) ? true : false);
  }, [wishlist]);

  const handleAddToWishlist = (id) => {
    dispatch(!isFav ? addProductToWishlist(id) : removeProductFromWishlist(id));
    setTimeout(() => {
      dispatch(fetchAllWishlist());
      fetchProduct();
    }, 1000);
  };

  useEffect(() => {
    const getDeviceType = () => {
      const ua = navigator.userAgent;
      if (/mobile/i.test(ua)) {
        return "Mobile";
      } else if (/iPad|Android|Touch/i.test(ua)) {
        return "Tablet";
      } else {
        return "Desktop";
      }
    };

    setDeviceType(getDeviceType());
  }, []);

  const renderImagesAsList = (device) => (
    <div className={styles.imageList}>
      <Swiper
        slidesPerView={"auto"}
        spaceBetween={5}
        freeMode={true}
        loop={true}
        className="mySwiper4"
        modules={[Autoplay, Navigation, Pagination, FreeMode]}
        autoplay={{ delay: 4100}}
        speed={351}
      >
        <SwiperSlide>
          <Link to={"/productdetails/" + product.id}
                        style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
>
            <img
            // className="w-100 bg-"
            className={styles.productImage}
              src={product.photo || product}
              alt={product.name}
            />
          </Link>
        </SwiperSlide>
        {product.images.map((image, imageIndex) => (
          <SwiperSlide
            key={imageIndex + image.created_at}
            id={image.created_at}
          >
            <Link to={"/productdetails/" + product.id} className="d-flex justify-content-center align-items-center"
                          style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
>
              <img
              className={styles.productImage}
              // className="w-100"
                // style={{width: "100%", height: device === "Mobile" ? "350px" : 'auto' }}
                src={image.image}
                alt={product.name}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );

  // const renderImagesAsSlider = () => {
  //   const settings = {
  //     dots: true,
  //     infinite: true,
  //     speed: 200,
  //     slidesToShow: 1,
  //     slidesToScroll: 1,
  //   };

  //   return (
  //     <Swiper
  //       // pagination={true}
  //       // className="jwnjwni"
  //       // slidesPerView={"auto"}
  //       //   // spaceBetween={5}
  //       //   freeMode={true}
  //       //   loop={true}
  //       //   modules={[Navigation, Autoplay]}
  //       //   autoplay={{ delay: 4100, disableOnInteraction: false }}
  //       //   speed={350}
  //       slidesPerView={"auto"}
  //       spaceBetween={5}
  //       freeMode={true}
  //       loop={true}
  //       className="mySwiper"
  //       modules={[Autoplay, Navigation, FreeMode]}
  //       autoplay={{ delay: 4100, disableOnInteraction: false }}
  //       speed={350}
  //     >
  //       {product.images?.map((image) => (
  //         <SwiperSlide>
  //           <img src={image.image} className="w-100" alt="" />
  //         </SwiperSlide>
  //       ))}
  //       {(!product.images || product.images.length == 0) && (
  //         <SwiperSlide>
  //           <img src={product.photo} className="w-100" alt="" />
  //         </SwiperSlide>
  //       )}
  //     </Swiper>
  //   );
  // };

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setSelectedQuantity(parseInt(event.target.value));
  };

  const navigation = useNavigate();

  const handleBuyClick = () => {
    if (!selectedQuantity) {
      setIsReq(true);
      setTimeout(() => {
        setIsReq(false);
      }, 1000);
    } else {
      dispatch(
        addProductToCart({
          id: id,
          color: selectedColor,
          quantity: selectedQuantity,
          size: selectedSize,
        })
      );
      // navigation('/cart')
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  const toggleSize = () => {
    setsize(!size);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = () => {
    if (!selectedQuantity) {
      setIsReq(true);
      setTimeout(() => {
        setIsReq(false);
      }, 1000);
    } else {
      dispatch(
        addProductToCart({
          id: id,
          color: selectedColor || "none",
          quantity: selectedQuantity || "none",
          size: selectedSize || "none",
        })
      );
    }
  };

  return (
    <div
      className={`${styles.productDetailsContainer} product_details_wrapper`}
    >
      <div className={styles.imagesContainer}>
        {/* Heart icon */}
        <button
          onClick={() => handleAddToWishlist(id)}
          style={{
            background: "transparent",
            border: "none",
            width: "max-content",
          }}
          className={"fs-3 text-decoration-none text-black px-3"}
        >
          {isFav ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 39 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.5 5.5L11 2L19.5 5.5L25 3H31L36 5.5V12L26.5 27L19.5 33L11 26L2.5 14.5L3.5 5.5Z"
                fill="#FC4343"
              />
              <path
                d="M21.45 35H17.55V33.0556H15.6V31.1111H13.65V29.1667H11.7V27.2222H9.75V25.2778H7.8V23.3333H5.85V21.3889H3.9V19.4444H1.95V15.5556H0V5.83333H1.95V3.88889H3.9V1.94444H5.85V0H15.6V1.94444H17.55V3.88889H21.45V1.94444H23.4V0H33.15V1.94444H35.1V3.88889H37.05V5.83333H39V15.5556H37.05V19.4444H35.1V21.3889H33.15V23.3333H31.2V25.2778H29.25V27.2222H27.3V29.1667H25.35V31.1111H23.4V33.0556H21.45V35ZM7.8 17.5V19.4444H9.75V21.3889H11.7V23.3333H13.65V25.2778H15.6V27.2222H17.55V29.1667H21.45V27.2222H23.4V25.2778H25.35V23.3333H27.3V21.3889H29.25V19.4444H31.2V17.5H33.15V13.6111H35.1V7.77778H33.15V5.83333H31.2V3.88889H25.35V5.83333H23.4V7.77778H21.45V9.72222H17.55V7.77778H15.6V5.83333H13.65V3.88889H7.8V5.83333H5.85V7.77778H3.9V13.6111H5.85V17.5H7.8Z"
                fill="#121212"
              />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.2 24H10.8V22.6667H9.6V21.3333H8.4V20H7.2V18.6667H6V17.3333H4.8V16H3.6V14.6667H2.4V13.3333H1.2V10.6667H0V4H1.2V2.66667H2.4V1.33333H3.6V0H9.6V1.33333H10.8V2.66667H13.2V1.33333H14.4V0H20.4V1.33333H21.6V2.66667H22.8V4H24V10.6667H22.8V13.3333H21.6V14.6667H20.4V16H19.2V17.3333H18V18.6667H16.8V20H15.6V21.3333H14.4V22.6667H13.2V24ZM4.8 12V13.3333H6V14.6667H7.2V16H8.4V17.3333H9.6V18.6667H10.8V20H13.2V18.6667H14.4V17.3333H15.6V16H16.8V14.6667H18V13.3333H19.2V12H20.4V9.33333H21.6V5.33333H20.4V4H19.2V2.66667H15.6V4H14.4V5.33333H13.2V6.66667H10.8V5.33333H9.6V4H8.4V2.66667H4.8V4H3.6V5.33333H2.4V9.33333H3.6V12H4.8Z"
                fill="#121212"
              />
            </svg>
          )}
        </button>
        {/* Product images */}
        {deviceType
          ? renderImagesAsList(deviceType)
          : renderImagesAsList(deviceType)}
      </div>
      <div className={styles.detailsContainer}>
        <div
          className={`${styles.details} detail_1 d-flex justify-content-between align-items-center mt-3 mb-4`}
        >
          <h1 className="pt-4">{product.name}</h1>
          <p className="pt-4">EGP {product.price}</p>
        </div>
        <div className={styles.detailsContainer1}>
          <p>{product.about_product}</p>
        </div>
        <div className="my-3 selectContainer">
          <select
            id="sizeSelect"
            disabled={product.sizes.length < 1}
            className={isReq && !selectedSize ? "redBorder" : ""}
            value={selectedSize}
            onChange={handleSizeChange}
          >
            <option value="" className={styles.selection}>
              {product.sizes.length < 1 ? (
                <span>The sizes of the product are sold out</span>
              ) : (
                "Select Size"
              )}
            </option>
            {product.sizes?.map((size, index) => (
              <option key={index} value={size.size}>
                {size.size}
              </option>
            ))}
          </select>
        </div>
        <div className="my-3 selectContainer">
          <select
            disabled={product.colors.length < 1}
            id="colorSelect"
            className={isReq && !selectedColor ? "redBorder" : ""}
            value={selectedColor}
            onChange={handleColorChange}
          >
            <option value="" className={styles.selection}>
              {product.colors.length < 1 ? (
                <span>The color of the product are sold out</span>
              ) : (
                "Select Color"
              )}
            </option>
            {product.colors?.map((color, index) => (
              <option key={index} value={color.color}>
                {color.color}
              </option>
            ))}
          </select>
        </div>
        <div className="my-3 selectContainer">
          <select
            id="quantitySelect"
            className={isReq && !selectedQuantity ? "redBorder" : ""}
            value={selectedQuantity}
            onChange={handleQuantityChange}
          >
            <option value="" className={styles.selection}>
              Select Quantity
            </option>
            {/* Replace with actual quantity options based on your product data */}
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        {product.sale_status !== "sold_out" ? (
          <div className="my-3 d-flex flex-column">
            <button className={`${styles.buyBtn}`} onClick={handleBuyClick}>
              Buy
            </button>
            <button
              className={`${styles.addBtn}`}
              onClick={() => {
                handleAddToCart();
                dispatch(fetchAllCart());
              }}
              // onClick={() => handleAddToCartClick(product.id)}
            >
              Add to Cart
            </button>
          </div>
        ) : (
          <div className="my-3 d-flex flex-column justify-content-center align-items-center p-2">
            <h6 style={{ color: "gray" }}>Sold out</h6>
          </div>
        )}
        <div className="toggleFeature my-3 mb-0 d-flex flex-column m-0">
          <button
            className={`${
              styles.btnProductDetails
            } d-flex align-items-center justify-content-between ${
              showDetails ? "active" : ""
            } w-100  text-start p-4 border-left-0`}
            onClick={toggleDetails}
            aria-expanded={showDetails}
            aria-controls="productDetailsCollapse"
          >
            <span className={styles.detaills}>
              {showDetails ? "Product Details" : "Product Details"}
            </span>
            <i className={`fas fa-chevron-${showDetails ? "up" : "down"}`}></i>
          </button>
          <div
            className={`collapse ${showDetails ? "show" : ""}`}
            id="productDetailsCollapse"
          >
            <div className={`${styles.specificDetail} card card-body`}>
              {/* Replace with actual product details */}
              <p>{product.details}</p>
              {/* Add more product details as needed */}
            </div>
          </div>
        </div>

        <div className="toggleFeature toggleFeature2 my-5 mt-0 d-flex flex-column m-0">
          <button
            className={`${
              styles.btnProductDetails
            } d-flex align-items-center justify-content-between ${
              size ? "active" : ""
            } w-100  text-start p-4 border-left-0`}
            onClick={toggleSize}
            aria-expanded={size}
            aria-controls="productDetailsCollapse"
          >
            <span ame={styles.detaills}>
              {size ? "Size & Fit" : "Size & Fit"}
            </span>
            <i className={`fas fa-chevron-${size ? "up" : "down"}`}></i>
          </button>
          <div
            className={`collapse ${size ? "show" : ""}`}
            id="productDetailsCollapse"
          >
            <div className={`${styles.specificDetail} card card-body`}>
              {/* Replace with actual product details */}
              {product.sizes.map(({size, index}) => (
                <div key={index} style={{ fontSize: 12 }}>
                  {size.size}: {size.descrtions_size_fit}
                </div>
              ))}
              {/* Add more product details as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
