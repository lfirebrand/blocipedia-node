const wikiQueries = require("../db/queries.wikis.js");

module.exports = {
    index(req, res, next) {
        wikiQueries.getAllWikis((err, wikis) => {

            //#3
            if (err) {
                res.redirect(500, "static/index");
            } else {
                res.render("wikis/index", {
                    wikis
                });
            }
        })
    },

    new(req, res, next) {
        res.render("wikis/new");
    },

    create(req, res, next) {
        let newWiki = {
            title: req.body.title,
            body: req.body.body,
            private: req.body.private
        };
        wikiQueries.addWiki(newWiki, (err, wiki) => {
            if(err){
                res.redirect(500, "/wikis/new");
            } else {
                res.redirect(303, `/wikis/${wiki.id}`);
            }
        });
    }
}