const commentResolver = require("./commentResolver");
const likeResolver = require("./likeResolver");
const postResolver = require("./postResolver");
const userResolver = require("./userResolver");

module.exports = [userResolver, postResolver, commentResolver, likeResolver]