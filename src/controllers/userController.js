 const userQueries = require("../db/queries.users.js");
 const wikiQueries = require("../db/queries.wikis.js");
 const passport = require("passport");
 const User = require("../db/models/").User;
 const stripe = require("stripe")("sk_test_yxdNiFMtufkOmsavSK7Fg9K8");

module.exports = {
    signUp(req, res, next) {
        res.render("users/signup");
    },

    create(req, res, next) {
        let newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };
        userQueries.createUser(newUser, (err, user) => {
            if (err) {
                req.flash("error", err);
                res.redirect("/users/signup");
            } else {

                passport.authenticate("local")(req, res, () => {
                    req.flash("notice", "You've successfully signed in!");
                    res.redirect("/");
                })
            }
        })
        
    },

    signInForm(req, res, next) {
        res.render("users/sign_in");
    },

    signIn(req, res, next) {
        passport.authenticate("local", {successFlash: "Welcome!"})(req, res, function () {
            if (!req.user) {
                req.flash("notice", "Sign in failed. Please try again.")
                res.redirect("/users/sign_in");
            } else {
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/wikis");
            }
        })
    },

    signOut(req, res, next) {
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
    },

    show(req, res, next) {
        userQueries.getUser(req.params.id, (err, user) => {
            if(err || user === undefined){
                req.flash("notice", "No user found with that ID.");
                res.redirect("/");
            } else {
                res.render("users/show", {user});
            }
        });
    },

   // showUpgradePage(req, res, next){
   //     userQueries.getUser(req.params.id, (err, user) => {
   //         if(err || user === undefined){
     //           req.flash("notice", "No user found with that ID.");
       //         res.render("/");
         //   } else {
           //     res.render("users/upgrade", {user});
         //   }
       // });
    //},

    //upgrade(req, res, next){
      //  const token = req.body.stripeToken;
        //const email = req.body.stripeEmail;
       // User.findOne({
      //      where: {email: email}
      //  })
      //  .then((user) => {
       //     if(user){
       //         const charge = stripe.charges.create({
        //            amount: 1500,
          //          currency: 'usd',
            //        description: 'Upgrade to premium',
            //        source: token,
           //     })
           //     .then((result) => {
             //       if(result){
             //           userQueries.toggleRole(user);
               //         req.flash("notice", "Congrats! Upgrade successful!");
              //          res.redirect("/wikis");
                //    } else {
               //         req.flash("notice", "Upgrade unsuccessful.");
               //         res.redirect("users/show", {user});
           //         }
         //       })
       //     } else {
      //          req.flash("notice", "Upgrade unsuccessful.");
        //        res.redirect("users/upgrade");
       //     }
      //  })
   // },
    
 //   showDowngradePage(req, res, next){
   //     userQueries.getUser(req.params.id, (err, user) => {
     //       if(err || user === undefined){
       //         req.flash("notice", "No user found with that ID.");
         //       res.redirect("/");
           // } else {
             //   res.render("users/downgrade", {user});
         //   }
      //  });
   // },

   // downgrade(req, res, next) {
     //   userQueries.getUser(req.params.id, (err, user) => {
       //     if (err || user === undefined) {
         //       req.flash("notice", "Downgrade unsuccessful.");
           //     res.redirect("/users/show", {
             //       user
         //       });
        //    } else {
         //       wikiQueries.togglePrivacy(user);
           //     userQueries.toggleRole(user);
             //   req.flash("notice", "Downgrade successful!");
           //     res.redirect("/");
           // }
 //       })
  //  }
    upgrade(req, res, next) {
            res.render('users/upgrade', {
                publicKey
            });
        },

        payment(req, res, next) {
            stripe.customers
                .create({
                    email: req.body.stripeEmail,
                    source: req.body.stripeToken,
                })
                .then(customer => {
                    stripe.charges.create({
                        amount: 1500,
                        description: 'Blocipedia Premium Membership Test Fee',
                        currency: 'USD',
                        customer: customer.id,
                    });
                })
                .then(charge => {
                    userQueries.upgrade(req.user.dataValues.id);
                    res.redirect('/');
                });
        },

        downgrade(req, res, next) {
            userQueries.downgrade(req.user.dataValues.id);
            wikiQueries.makePublic(req.user.dataValues.id); 
          //  wikiQueries.privateToPublic(req.user.dataValues.id);
            req.flash('notice', 'You are no longer a premium user and your private wikis are now public.');
            res.redirect('/');
        },

        showCollaborations(req, res, next) {
            console.log(req.user.id);
            userQueries.getUser(req.user.id, (err, result) => {
                user = result["user"];
                collaborations = result["collaborations"];
                if (err || user == null) {
                    res.redirect(404, "/");
                } else {
                    res.render("users/collaborations", {
                        user,
                        collaborations
                    });
                }
            });
        }

}