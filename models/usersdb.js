const mongoose = require('mongoose');
/*
username = Name that appears on the user's discord profile
tag = Account name#1234 account name
id = unique id for discord
summoner = created using the !register <user> function. will add op.gg or riot api implementation in the future
*/
const userSchema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
        required: [true, 'Discord username required']
	},
	tag: {
		type: String,
		unique: true,
        required: [true, 'Discord tag required']
	},
	id: {
		type: String,
        unique: true,
        required: [true, 'Discord ID required']
	},
	summoner: {
		type: String,
        unique: true,
        required: [true, 'Summoner name required']
    },
    rank: {
        type: String,
        validate: {
          validator: function(v) {
            return /^(((iron)|(bronze)|(silver)|(gold)|(platinum)|(diamond)) (1|2|3|4))|((challenger)|(grandmaster)|(master))$/.test(v);
          },
          message: props => `${props.value} is not a valid summoner rank!`
        },
        required: [true, 'Summoner rank required']
    },
    rankPoints: {
        type: Number,
        required: true
    }
}, {
	timestamps:true
});

module.exports = mongoose.model('InhouseUser', userSchema);