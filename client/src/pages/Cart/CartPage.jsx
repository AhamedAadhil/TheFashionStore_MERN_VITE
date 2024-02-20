// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { MdDeleteOutline } from "react-icons/md";
// import Button from "react-bootstrap/esm/Button";

// export default function CartPage() {

//     const [cartItems,setCartItems]=useState([]);

//     // useEffect(()=>{
//     //     const fetchCartData=async()=>{
//     //         try {
//     //              let response = await fetch("/api/buyer/actions/getUserCart", {
//     //                method: "GET",
//     //                headers: {
//     //                  "Content-Type": "application/json",
//     //                },
//     //              });
//     //              if (!response.ok) {
//     //                console.log(response.message);
//     //              }
//     //              const data = response.json();
//     //              setCartItems(data);
//     //         } catch (error) {
//     //             console.log(error.message)
//     //         }

//     //     }
//     //     fetchCartData();
//     // })

//     const totalPrice = cartItems.carttotal;
//     const priceAfterDiscount = cartItems.totalafterdiscount;

//     // const handleDelete = async()=>{
//     //     try {
//     //          const response = await fetch(
//     //            `/api/buyer/actions/deleteProductFromCart/${productIdInCart}`,
//     //            {
//     //              method: "DELETE",
//     //              headers: {
//     //                "Content-Type": "application/json",
//     //              },
//     //            }
//     //          );
//     //          if (!response.ok) {
//     //            console.log(response.message);
//     //          }
//     //          const data = await response.json();
//     //     } catch (error) {
//     //         console.log(error.message)
//     //     }

//     //     //write something to do if succssful delete
//     // }

//   return (
//     <div className="shop-cart padding-tb">
//       <div className="container">
//         <div className="section-wrapper">
//           {/* cart top */}
//           <div className="cart-top">
//             <table>
//               <thead>
//                 <tr>
//                   <th className="cat-product">Product</th>
//                   <th className="cat-price">Price</th>
//                   <th className="cat-quantity">Quantity</th>
//                   <th className="cat-toprice">Total</th>
//                   <th className="cat-edit">Edit</th>
//                 </tr>
//               </thead>
//               {/* table body */}
//               <tbody>
//                 {cartItems.map((item, index) => (
//                   <tr key={index}>
//                     <td className="product-item cat-product">
//                       <div className="p-thumb">
//                         <Link to="/shop">
//                           {" "}
//                           <img src={item.imageUrls[0]} alt="" />
//                         </Link>
//                       </div>
//                       <div className="p-content">
//                         <Link to="/shop">{item.name}</Link>
//                       </div>
//                     </td>
//                     <td className="cat-price">Rs. {item.price}</td>
//                     <td className="cat-quantity">{item.quantity}</td>
//                     <td className="cat-toprice">{item.totalafterdiscount}</td>
//                     <td className="cat-edit">
//                       <Link onClick={() => handleDelete(item._id)}>
//                         <MdDeleteOutline style={{ color: "red" }} />
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           {/* cart top ends */}
//           {/* cart bottom */}
//           <div className="cart-bottom">
//             <div className="cart-checkout-box">
//               <form className="coupon">
//                 <input
//                   type="text"
//                   name="coupon"
//                   id="coupon"
//                   className="cart-page-input-text"
//                   placeholder="Coupon Code"
//                   style={{ textTransform: "uppercase" }}
//                 />
//                 <input type="submit" value="Apply Coupon" />
//               </form>
//               <form action="" className="cart-checkout">
//                 <input type="text" value="Update Cart" />
//                 <div><Button variant="primary" className="py-2" onClick={handleCheckout}>Proceed to Checkout</Button></div>
//               </form>
//             </div>
//             {/* checkout box end */}
//             {/* Shopping box */}
//             <div className="shiping-box">
//               <div className="row ">
//                 <div className="col-md-6 col-12">
//                   <div className="calculate-shiping">
//                     <h3>Calculate Shiping</h3>
//                     <div className="outline-select">
//                       <select>
//                         <option value="uk">United Kingdom (UK)</option>
//                         <option value="uk">VBangalaDesh</option>
//                         <option value="uk">United Pakistan (UK)</option>
//                         <option value="uk">India</option>
//                       </select>
//                       <span className="select-icon">
//                         <i className="icofont-rounded-down"></i>
//                       </span>
//                     </div>
//                     <div className="outline-select shipping-select">
//                       <select>
//                         <option value="uk">Akp</option>
//                         <option value="uk">Kalmunai</option>
//                         <option value="uk">Palamunai</option>
//                         <option value="uk">Pottuvil</option>
//                       </select>
//                       <span className="select-icon">
//                         <i className="icofont-rounded-down"></i>
//                       </span>
//                     </div>
//                     <input
//                       type="text"
//                       name="postalcode"
//                       id="postalcode"
//                       className="cart-page-input-text"
//                       placeholder="PostalCode/ZIP *"
//                     />
//                     <button type="submit">Update Address</button>
//                   </div>
//                 </div>
//                 <div className="col-md-6 col-12">
//                   <div className="cart-overview">
//                     <h3>Cart Totals</h3>
//                     <ul className="lab-ul">
//                       <li>
//                         <span className="pull-left">Cart Total</span>
//                         <p className="pull-right">
//                           Rs. {totalPrice.toFixed(2)}
//                         </p>
//                       </li>
//                       <li>
//                         <span className="pull-left">Coupon Discount</span>
//                         <p className="pull-right">
//                           Rs.{" "}
//                           {Number(totalPrice.toFixed(2)) -
//                             Number(priceAfterDiscount.toFixed(2))}
//                         </p>
//                       </li>
//                       <li>
//                         <span className="pull-left">Shipping Fee</span>
//                         <p className="pull-right">Free Shipping</p>
//                       </li>
//                       <li>
//                         <span className="pull-left">Order Total</span>
//                         <p className="pull-right">
//                           Rs. {priceAfterDiscount.toFixed(2)}
//                         </p>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
