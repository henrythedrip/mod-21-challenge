const { User } = require('../models');

const { signToken } = require('../utils/auth');

const { GraphQLError } = require('graphql');

module.exports = {
    Query: {
        getSingleUser: async (parent, { username }, context) => {
            if (!context.user) {
                throw new GraphQLError('You need to be logged in!');
            }
            return User.findOne({ username });
        },
        me: async (parent, args, context) => {
            console.log("Context: ", context);
            if (context.user) {
                return await User.findOne({ _id: context.user._id }).populate('savedBooks');
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            console.log('this should fire from apollo when trying to login');
            const searchQuery = email.includes("@") ? { email } : { username: email };
            const user = await User.findOne(searchQuery);

            if (!user) {
                throw new GraphQLError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new GraphQLError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { authors, description, bookId, image, link, title }, context) => {
            console.log(authors);
            console.log(description);
            console.log(bookId);
            console.log(image);
            console.log(link);
            console.log(title);
            if (!context.user) {
                throw new GraphQLError('You need to be logged in!');
            }
            // console.log(user);
            try {
                const updatedUser = await User.findByIdAndUpdate(
                    // { _id: user },
                    context.user._id,
                    { $addToSet: { savedBooks: { authors, description, bookId, image, link, title } } },
                    { new: true, runValidators: true }
                ).populate('savedBooks');;
                return updatedUser;
            } catch (err) {
                // console.log(err);
                return new GraphQLError(err.message);
            }
        },
        // remove a book from `savedBooks`
        deleteBook: async (parent, { user, bookId }, context) => {
            if (!context.user) {
                throw new GraphQLError('You need to be logged in!');
            }
            const updatedUser = await User.findOneAndUpdate(
                { _id: user },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
            );
            if (!updatedUser) {
                return GraphQLError(err.message)
            }
            return updatedUser;
        },
    }

}