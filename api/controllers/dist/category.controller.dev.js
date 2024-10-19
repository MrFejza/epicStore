"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCategory = exports.updateCategory = exports.getAllCategories = exports.createCategory = void 0;

var _categoryModel = _interopRequireDefault(require("../models/category.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Create a new category
var createCategory = function createCategory(req, res) {
  var _req$body, name, slug, insertAtIndex, category;

  return regeneratorRuntime.async(function createCategory$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, slug = _req$body.slug, insertAtIndex = _req$body.insertAtIndex;

          if (!(!name || slug === undefined)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: 'Category name and slug are required'
          }));

        case 3:
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(_categoryModel["default"].updateMany({
            order: {
              $gte: insertAtIndex
            }
          }, {
            $inc: {
              order: 1
            }
          }));

        case 6:
          // Create the new category with the specified order
          category = new _categoryModel["default"]({
            name: name,
            slug: slug,
            order: insertAtIndex
          });
          _context.next = 9;
          return regeneratorRuntime.awrap(category.save());

        case 9:
          res.status(201).json({
            message: 'Category created successfully',
            category: category
          });
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](3);
          console.error(_context.t0);
          res.status(500).json({
            error: 'Server error'
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 12]]);
}; // Get all categories


exports.createCategory = createCategory;

var getAllCategories = function getAllCategories(req, res) {
  var categories;
  return regeneratorRuntime.async(function getAllCategories$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_categoryModel["default"].find({}).sort({
            order: 1
          }));

        case 3:
          categories = _context2.sent;
          // Sort by order (ascending)
          res.status(200).json(categories);
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: 'Server error.'
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Update a category


exports.getAllCategories = getAllCategories;

var updateCategory = function updateCategory(req, res) {
  var id, _req$body2, name, slug, updatedCategory;

  return regeneratorRuntime.async(function updateCategory$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id; // Category ID from request

          _req$body2 = req.body, name = _req$body2.name, slug = _req$body2.slug; // New name and slug for the category

          if (name) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Category name is required.'
          }));

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap(_categoryModel["default"].findByIdAndUpdate(id, {
            name: name,
            slug: slug
          }, {
            "new": true
          }));

        case 7:
          updatedCategory = _context3.sent;

          if (updatedCategory) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Category not found.'
          }));

        case 10:
          res.status(200).json({
            message: 'Category updated successfully.',
            updatedCategory: updatedCategory
          });
          _context3.next = 16;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            error: 'Server error.'
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; // Delete a category


exports.updateCategory = updateCategory;

var deleteCategory = function deleteCategory(req, res) {
  var id, deletedCategory;
  return regeneratorRuntime.async(function deleteCategory$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id; // Find and delete the category

          _context4.next = 4;
          return regeneratorRuntime.awrap(_categoryModel["default"].findByIdAndDelete(id));

        case 4:
          deletedCategory = _context4.sent;

          if (deletedCategory) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: 'Category not found.'
          }));

        case 7:
          res.status(200).json({
            message: 'Category deleted successfully.'
          });
          _context4.next = 13;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            error: 'Server error.'
          });

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.deleteCategory = deleteCategory;