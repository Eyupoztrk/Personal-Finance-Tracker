
const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');
const config = require("../config");
const db = require("../database/Models");

const { User } = db;



module.exports = function () {

    let strategy = new Strategy({
        secretOrKey: config.JWT.SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()

    },
        async (payload, done) => {
            console.log("🔐 Payload geldi mi?", payload);
            try {

                let user = await User.findById(payload.id);
                console.log("user");

                if (user) {

                    done(null, {
                        id: user.id,
                        email: user.email,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        currency: user.currency,
                        is_active: user.is_active,
                        email_verified: user.email_verified,
                        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
                    });
                } else {

                    done(new Error("user not fount"), null);
                }
            }
            catch (err) {

                done(err, null);
            }

        }
    );


    passport.use(strategy);

    return {
        initialize: function () {
            return passport.initialize();
        },
        authenticate: function () {
            return passport.authenticate("jwt", { session: false });
        }


    }
}