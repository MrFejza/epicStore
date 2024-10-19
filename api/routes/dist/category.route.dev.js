"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _categoryController = require("../controllers/category.controller.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // Route for creating a category


router.post('/create', _categoryController.createCategory); // Route for retrieving all categories

router.get('/', _categoryController.getAllCategories); // Route for updating a category

router.put('/:id', _categoryController.updateCategory); // Route for deleting a category

router["delete"]('/:id', _categoryController.deleteCategory);
var _default = router;
exports["default"] = _default;