"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCategory = exports.updateCategory = exports.getAllCategories = exports.insertCategoryAtIndex = exports.addCategoryToEnd = exports.normalizeCategoryOrder = void 0;

var _categoryModel = _interopRequireDefault(require("../models/category.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var normalizeCategoryOrder = function normalizeCategoryOrder(req, res) {
  var categories, i;
  return regeneratorRuntime.async(function normalizeCategoryOrder$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_categoryModel["default"].find().sort({
            order: 1
          }));

        case 3:
          categories = _context.sent;
          i = 0;

        case 5:
          if (!(i < categories.length)) {
            _context.next = 12;
            break;
          }

          categories[i].order = i + 1;
          _context.next = 9;
          return regeneratorRuntime.awrap(categories[i].save());

        case 9:
          i++;
          _context.next = 5;
          break;

        case 12:
          res.status(200).json({
            message: 'Category order normalized successfully'
          });
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          console.error("Error normalizing category order:", _context.t0);
          res.status(500).json({
            error: 'Failed to normalize category order'
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
}; // Create a new category


exports.normalizeCategoryOrder = normalizeCategoryOrder;

var addCategoryToEnd = function addCategoryToEnd(req, res) {
  var _req$body, name, slug, maxOrderCategory, newOrder, category;

  return regeneratorRuntime.async(function addCategoryToEnd$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, slug = _req$body.slug;

          if (!(!name || slug === undefined)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: 'Category name and slug are required'
          }));

        case 3:
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(_categoryModel["default"].findOne().sort({
            order: -1
          }));

        case 6:
          maxOrderCategory = _context2.sent;
          newOrder = maxOrderCategory ? maxOrderCategory.order + 1 : 1; // If no categories exist, start with order 1
          // Create the new category with the next order value

          category = new _categoryModel["default"]({
            name: name,
            slug: slug,
            order: newOrder
          });
          _context2.next = 11;
          return regeneratorRuntime.awrap(category.save());

        case 11:
          res.status(201).json({
            message: 'Category added at the end successfully',
            category: category
          });
          _context2.next = 18;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](3);
          console.error(_context2.t0);
          res.status(500).json({
            error: 'Server error'
          });

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 14]]);
}; // Controller to insert a category at a specified index


exports.addCategoryToEnd = addCategoryToEnd;

var insertCategoryAtIndex = function insertCategoryAtIndex(req, res) {
  var _req$body2, name, slug, insertAtIndex, categoriesToShift, i, newCategory;

  return regeneratorRuntime.async(function insertCategoryAtIndex$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body2 = req.body, name = _req$body2.name, slug = _req$body2.slug, insertAtIndex = _req$body2.insertAtIndex;

          if (!(!name || slug === undefined || insertAtIndex === undefined)) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Category name, slug, and insert index are required'
          }));

        case 3:
          _context3.prev = 3;
          _context3.next = 6;
          return regeneratorRuntime.awrap(_categoryModel["default"].find({
            order: {
              $gte: insertAtIndex
            }
          }).sort({
            order: 1
          }));

        case 6:
          categoriesToShift = _context3.sent;
          i = categoriesToShift.length - 1;

        case 8:
          if (!(i >= 0)) {
            _context3.next = 15;
            break;
          }

          categoriesToShift[i].order += 1;
          _context3.next = 12;
          return regeneratorRuntime.awrap(categoriesToShift[i].save());

        case 12:
          i--;
          _context3.next = 8;
          break;

        case 15:
          // Now create the new category with the specified insertAtIndex
          newCategory = new _categoryModel["default"]({
            name: name,
            slug: slug,
            order: insertAtIndex
          });
          _context3.next = 18;
          return regeneratorRuntime.awrap(newCategory.save());

        case 18:
          res.status(201).json({
            message: 'Category inserted at specified index successfully',
            category: newCategory
          });
          _context3.next = 25;
          break;

        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](3);
          console.error("Error in insertCategoryAtIndex:", _context3.t0);
          res.status(500).json({
            error: 'Server error'
          });

        case 25:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 21]]);
}; // Get all categories


exports.insertCategoryAtIndex = insertCategoryAtIndex;

var getAllCategories = function getAllCategories(req, res) {
  var categories, i, j;
  return regeneratorRuntime.async(function getAllCategories$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_categoryModel["default"].find({}).sort({
            order: 1
          }));

        case 3:
          categories = _context4.sent;
          i = 0;

        case 5:
          if (!(i < categories.length)) {
            _context4.next = 19;
            break;
          }

          if (!(categories[i].order !== i + 1)) {
            _context4.next = 16;
            break;
          }

          j = 0;

        case 8:
          if (!(j < categories.length)) {
            _context4.next = 15;
            break;
          }

          categories[j].order = j + 1;
          _context4.next = 12;
          return regeneratorRuntime.awrap(categories[j].save());

        case 12:
          j++;
          _context4.next = 8;
          break;

        case 15:
          return _context4.abrupt("break", 19);

        case 16:
          i++;
          _context4.next = 5;
          break;

        case 19:
          // Send the sorted and normalized categories
          res.status(200).json(categories);
          _context4.next = 26;
          break;

        case 22:
          _context4.prev = 22;
          _context4.t0 = _context4["catch"](0);
          console.error('Error in getAllCategories:', _context4.t0);
          res.status(500).json({
            error: 'Server error.'
          });

        case 26:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 22]]);
}; // Update a category


exports.getAllCategories = getAllCategories;

var updateCategory = function updateCategory(req, res) {
  var id, _req$body3, name, slug, updatedCategory;

  return regeneratorRuntime.async(function updateCategory$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          id = req.params.id; // Category ID from request

          _req$body3 = req.body, name = _req$body3.name, slug = _req$body3.slug; // New name and slug for the category

          if (name) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: 'Category name is required.'
          }));

        case 5:
          _context5.next = 7;
          return regeneratorRuntime.awrap(_categoryModel["default"].findByIdAndUpdate(id, {
            name: name,
            slug: slug
          }, {
            "new": true
          }));

        case 7:
          updatedCategory = _context5.sent;

          if (updatedCategory) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: 'Category not found.'
          }));

        case 10:
          res.status(200).json({
            message: 'Category updated successfully.',
            updatedCategory: updatedCategory
          });
          _context5.next = 16;
          break;

        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            error: 'Server error.'
          });

        case 16:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; // Delete a category


exports.updateCategory = updateCategory;

var deleteCategory = function deleteCategory(req, res) {
  var id, deletedCategory;
  return regeneratorRuntime.async(function deleteCategory$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          id = req.params.id; // Find and delete the category

          _context6.next = 4;
          return regeneratorRuntime.awrap(_categoryModel["default"].findByIdAndDelete(id));

        case 4:
          deletedCategory = _context6.sent;

          if (deletedCategory) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            error: 'Category not found.'
          }));

        case 7:
          res.status(200).json({
            message: 'Category deleted successfully.'
          });
          _context6.next = 13;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            error: 'Server error.'
          });

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.deleteCategory = deleteCategory;