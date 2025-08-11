import React from 'react';
import './ProductCard.css';

const ProductCard = ({ 
  image, 
  title, 
  description, 
  weight, 
  pieces, 
  price, 
  oldPrice, 
  discount,
  quantity,
  onAddToCart,
  onIncrement,
  onDecrement,

}) => { 
  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-image" />

      <div className="product-details">
        <h3 className="product-title">{title}</h3>
        <p className="product-description">{description}</p>
        <p className="product-weight">
          {weight} {pieces && `| ${pieces} Pieces`}
        </p>

        <div className="product-price">
          <span className="current-price">₹{price}</span>
          {oldPrice && (
            <>
              <span className="old-price">₹{oldPrice}</span>
              <span className="discount">{discount}% off</span>
            </>
          )}
        </div>
      </div>

      {/* ✅ Add button and quantity counter at same level */}
      {quantity > 0 ? (
        <div className="quantity-controls fade-in">
          <button className="counter-btn" onClick={onDecrement}>−</button>
          <span className="quantity">{quantity}</span>
          <button className="counter-btn" onClick={onIncrement}>+</button>
        </div>
      ) : (
        <button className="add-btn fade-in" onClick={onAddToCart}>
          Add
        </button>
      )}
    </div>
  );
};

export default ProductCard;
