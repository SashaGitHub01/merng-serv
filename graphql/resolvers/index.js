const commentResolver = require("./commentResolver");
const likeResolver = require("./likeResolver");
const postResolver = require("./postResolver");
const uploadResolver = require("./uploadResolver");
const userResolver = require("./userResolver");

module.exports = [userResolver, postResolver, commentResolver, likeResolver, uploadResolver]