const validatorData = {};

const check = (field) => {
    return {
        isPassword: () => {
            if (field.length < 6 || field.length > 30) {
                validatorData.msg = "Password must be between 6 and 30 characters.";
                return false;
            }
            let re = /^[a-zA-Z0-9 !"#\$%&'\(\)\*\+,-\./:;<=>\?@\[\\\]\^_`\{\|\}~]+$/;
            let res = re.test(field);
            if (!res) validatorData.msg = "Password contains invalid characters.";
            return res;
        },
        isEmail: () => {
            let re = /\S+@\S+\.\S+/;
            let res = re.test(field);
            if (!res) validatorData.msg = "Email is an incorrect format.";
            return res;
        },
        isUsername: () => {
            if (field.length < 4 || field.length > 22) {
                validatorData.msg = "Username must be between 4 and 22 characters.";
                return false;
            }
            let re = /^[a-zA-Z0-9-_.]+$/;
            let res = re.test(field);
            if (!res) validatorData.msg = "Username contains invalid characters.";
            return res;
        },
    }
}

// tests
// console.log(check('!"#$%&\'()*+,-./:;<=>?@').isPassword());
// console.log(check('[\]^_` {|}~').isPassword());
// console.log(check('[\]^_` {|}~').isUsername());
// console.log(check('spaceRanger-69_hi').isUsername());

module.exports = {
    check, validatorData
};