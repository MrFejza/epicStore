"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProductsByCategory = exports.getProducts = exports.createProduct = void 0;

var _productModel = _interopRequireDefault(require("../models/product.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Create a new product
var createProduct = function createProduct(req, res) {
  var _req$body, name, price, description, stock, category, popular, onSale, salePrice, saleEndDate, images, newProduct;

  return regeneratorRuntime.async(function createProduct$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, name = _req$body.name, price = _req$body.price, description = _req$body.description, stock = _req$body.stock, category = _req$body.category, popular = _req$body.popular, onSale = _req$body.onSale, salePrice = _req$body.salePrice, saleEndDate = _req$body.saleEndDate; // Ensure that the images are handled correctly if they exist

          images = req.files ? req.files.map(function (file) {
            return "/uploads/".concat(file.filename);
          }) : []; // Validate required fields

          if (!(!name || !price || !description || images.length === 0)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Missing required fields: name, price, description, and at least one image are mandatory'
          }));

        case 5:
          newProduct = new _productModel["default"]({
            name: name,
            price: price,
            description: description,
            image: images,
            // Use images array here
            stock: stock === 'true',
            // Convert stock to boolean
            category: category,
            popular: popular === 'true',
            // Ensure it's a boolean
            onSale: onSale === 'true',
            // Ensure it's a boolean
            salePrice: onSale === 'true' && salePrice ? salePrice : null,
            // Sale price if applicable
            saleEndDate: onSale === 'true' && saleEndDate ? new Date(saleEndDate) : null // Optional sale end date

          });
          _context.next = 8;
          return regeneratorRuntime.awrap(newProduct.save());

        case 8:
          res.status(201).json(newProduct);
          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error('Error creating product:', _context.t0.message, _context.t0.stack);
          res.status(500).json({
            message: 'Error creating product',
            error: _context.t0.message
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // Get all products, or filter by onSale, sort by createdAt, or randomize


exports.createProduct = createProduct;

var getProducts = function getProducts(req, res) {
  var _req$query, onSale, sort, order, random, query, productsQuery, sortOrder, products, now;

  return regeneratorRuntime.async(function getProducts$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$query = req.query, onSale = _req$query.onSale, sort = _req$query.sort, order = _req$query.order, random = _req$query.random;
          query = {}; // Filter by onSale if specified

          if (onSale === 'true') {
            query.onSale = true;
          }

          if (!(random === 'true')) {
            _context3.next = 10;
            break;
          }

          _context3.next = 7;
          return regeneratorRuntime.awrap(_productModel["default"].aggregate([{
            $sample: {
              size: 10
            }
          }]));

        case 7:
          productsQuery = _context3.sent;
          _context3.next = 12;
          break;

        case 10:
          productsQuery = _productModel["default"].find(query); // Sorting by createdAt

          if (sort === 'createdAt') {
            sortOrder = order === 'asc' ? 1 : -1;
            productsQuery = productsQuery.sort({
              createdAt: sortOrder
            });
          }

        case 12:
          _context3.next = 14;
          return regeneratorRuntime.awrap(productsQuery);

        case 14:
          products = _context3.sent;
          // Check and update products with expired sales
          now = new Date();
          products.forEach(function _callee(product) {
            return regeneratorRuntime.async(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!(product.onSale && product.saleEndDate && new Date(product.saleEndDate) <= now)) {
                      _context2.next = 6;
                      break;
                    }

                    // Expired sale: update product to remove sale
                    product.onSale = false;
                    product.salePrice = null;
                    product.saleEndDate = null;
                    _context2.next = 6;
                    return regeneratorRuntime.awrap(product.save());

                  case 6:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          });
          res.status(200).json(products);
          _context3.next = 24;
          break;

        case 20:
          _context3.prev = 20;
          _context3.t0 = _context3["catch"](0);
          console.error('Error fetching products:', _context3.t0.message, _context3.t0.stack);
          res.status(500).json({
            message: 'Error fetching products',
            error: _context3.t0.message
          });

        case 24:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 20]]);
}; // Get products by category


exports.getProducts = getProducts;

var getProductsByCategory = function getProductsByCategory(req, res) {
  var category, products;
  return regeneratorRuntime.async(function getProductsByCategory$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          category = req.params.category; // Case-insensitive category search

          _context4.next = 4;
          return regeneratorRuntime.awrap(_productModel["default"].find({
            category: new RegExp("".concat(category, "$"), 'i')
          }));

        case 4:
          products = _context4.sent;

          if (products.length) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'No products found in this category'
          }));

        case 7:
          res.status(200).json(products);
          _context4.next = 14;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          console.error('Error fetching products by category:', _context4.t0.message, _context4.t0.stack);
          res.status(500).json({
            message: 'Error fetching products by category',
            error: _context4.t0.message
          });

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; // Get a product by ID


exports.getProductsByCategory = getProductsByCategory;

var getProductById = function getProductById(req, res) {
  var product;
  return regeneratorRuntime.async(function getProductById$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(_productModel["default"].findById(req.params.id));

        case 3:
          product = _context5.sent;

          if (product) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'Product not found'
          }));

        case 6:
          res.status(200).json(product);
          _context5.next = 13;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          console.error('Error fetching product:', _context5.t0.message, _context5.t0.stack);
          res.status(500).json({
            message: 'Error fetching product',
            error: _context5.t0.message
          });

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Update a product by ID


exports.getProductById = getProductById;

var updateProduct = function updateProduct(req, res) {
  var _req$body2, existingImages, _req$body2$removedIma, removedImages, onSale, salePrice, saleEndDate, newImages, updatedImages, updatedProduct;

  return regeneratorRuntime.async(function updateProduct$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$body2 = req.body, existingImages = _req$body2.existingImages, _req$body2$removedIma = _req$body2.removedImages, removedImages = _req$body2$removedIma === void 0 ? [] : _req$body2$removedIma, onSale = _req$body2.onSale, salePrice = _req$body2.salePrice, saleEndDate = _req$body2.saleEndDate;
          newImages = []; // Handle new images

          if (req.files && req.files.length > 0) {
            newImages = req.files.map(function (file) {
              return "/uploads/".concat(file.filename);
            });
          } // Safely filter out removed images


          updatedImages = existingImages ? existingImages.filter(function (img) {
            return !removedImages.includes(img);
          }) : []; // Update the product with new data

          _context6.next = 7;
          return regeneratorRuntime.awrap(_productModel["default"].findByIdAndUpdate(req.params.id, _objectSpread({}, req.body, {
            image: [].concat(_toConsumableArray(updatedImages), _toConsumableArray(newImages)),
            // Combine new and existing images
            stock: Boolean(req.body.stock),
            onSale: Boolean(onSale),
            // Ensure onSale is treated as a boolean
            salePrice: onSale === 'true' || onSale === true ? salePrice : null,
            // Set salePrice to null if onSale is false
            saleEndDate: onSale === 'true' || onSale === true ? saleEndDate ? new Date(saleEndDate) : null : null // Set saleEndDate only if onSale is true

          }), {
            "new": true
          }));

        case 7:
          updatedProduct = _context6.sent;

          if (updatedProduct) {
            _context6.next = 10;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: 'Product not found'
          }));

        case 10:
          res.status(200).json(updatedProduct);
          _context6.next = 17;
          break;

        case 13:
          _context6.prev = 13;
          _context6.t0 = _context6["catch"](0);
          console.error('Error updating product:', _context6.t0.message, _context6.t0.stack);
          res.status(500).json({
            message: 'Error updating product',
            error: _context6.t0.message
          });

        case 17:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; // Delete a product by ID


exports.updateProduct = updateProduct;

var deleteProduct = function deleteProduct(req, res) {
  var product;
  return regeneratorRuntime.async(function deleteProduct$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(_productModel["default"].findByIdAndDelete(req.params.id));

        case 3:
          product = _context7.sent;

          if (product) {
            _context7.next = 6;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: 'Product not found'
          }));

        case 6:
          res.status(200).json({
            message: 'Product deleted successfully'
          });
          _context7.next = 13;
          break;

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](0);
          console.error('Error deleting product:', _context7.t0.message, _context7.t0.stack);
          res.status(500).json({
            message: 'Error deleting product',
            error: _context7.t0.message
          });

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.deleteProduct = deleteProduct;