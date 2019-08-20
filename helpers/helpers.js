exports.responseWithError = (res, error) => {
    res.status(400);
    res.json({
        error
    });
};

exports.responseNotFound = (res, error) => {
    res.status(404);
    res.send('Not found');
};