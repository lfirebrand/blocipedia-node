const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;

describe("routes : users", () => {

    beforeEach((done) => {

        sequelize.sync({
                force: true
            })
            .then(() => {
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });

    });

    describe("GET /users/signup", () => {

        it("should render a view with a sign up form", (done) => {
            request.get(`${base}signup`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Sign up");
                done();
            });
        });

    });

    describe("POST /users", () => {

        // #1 Create a user with valid name, email and password
        it("should create a new user with valid values and redirect", (done) => {

            const options = {
                url: base,
                form: {
                    name: "Best User",
                    email: "user@example.com",
                    password: "123456789"
                }
            }

            request.post(options,
                (err, res, body) => {

                    // #2
                    User.findOne({
                            where: {
                                email: "user@example.com"
                            }
                        })
                        .then((user) => {
                            expect(user).not.toBeNull();
                            expect(user.email).toBe("user@example.com");
                            expect(user.id).toBe(1);
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                }
            );
        });

        // #3
        it("should not create a new user with invalid attributes and redirect", (done) => {
            request.post({
                    url: base,
                    form: {
                        name: "no",
                        email: "no",
                        password: "123456789"
                    }
                },
                (err, res, body) => {
                    User.findOne({
                            where: {
                                email: "no"
                            }
                        })
                        .then((user) => {
                            expect(user).toBeNull();
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                }
            );
        });

    });

    describe("GET /users/sign_in", () => {

        it("should render a view with a sign in form", (done) => {
            request.get(`${base}sign_in`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Sign in");
                done();
            });
        });

    });

    describe("GET /users/:id", () => {
        beforeEach((done) => {
            this.user;
            this.wiki;

            User.create({
                name: "lfirebrand",
                email: "test@example.com",
                password: "Spidey187"
            })
            .then((res) => {
                this.user = res;

                Wiki.create({
                    title: "Sample Wiki",
                    body: "This is a sample wiki",
                    userId: this.user.id,
                    private: null, 
                        include: {
                            model: Wiki,
                            as: "wikis"
                        }
                })
            })
        });

        it("should present a list of comments and posts a user has created", (done) => {

        request.get(`${base}${this.user.id}`, (err, res, body) => {

            // #5
            expect(body).toContain("Sample Wiki");
            expect(body).toContain("This is a sample wiki")
            done();
        });

        });
        });

});