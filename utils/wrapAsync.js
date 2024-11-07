module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

/* Used to Eliminate repeated use of try-catch blocks in routes while 
    Handling error  */ 