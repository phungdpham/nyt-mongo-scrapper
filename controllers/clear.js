var db = require('../models');

module.exports = {
    clearDB: function(req, res) {
        db.Headline.remove({})
            .then(function() {
                return db.Note.remote({});
            })
            .then(function() {
                res.json({ ok: true })
            });
    }
};