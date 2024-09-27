// components/ProductCard.js
import { Link } from "react-router-dom";

const ProductCard = ({ product, onDelete }) => (
  <div key={product._id} className="bg-white p-4 rounded-lg shadow-lg">
    <Link to={`/information/${product._id}`}>
      <img
        src={
          product.image && Array.isArray(product.image) && product.image.length > 0
            ? `http://localhost:9000/${product.image[0]}`
            : 'default-image-path.jpg'
        }
        alt={product.name ?? 'Product Image'}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h2 className="text-xl font-bold mb-2">{product.name}</h2>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <p>
        <strong>Cmimi:</strong>{' '}
        {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'ALL' }).format(
          product.price
        )}
      </p>
    </Link>
    {onDelete && (
      <button
        onClick={() => onDelete(product)}
        className="bg-red-600 ml-10 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-red-700 transition-colors"
      >
        Delete
      </button>
    )}
  </div>
);

export default ProductCard;
