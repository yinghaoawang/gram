const check = (field) => {
    return {
        isPassword: () => {
            if (field.length < 6 || field.length > 30) return false;
            let re = /^[a-zA-Z0-9 !"#\$%&'\(\)\*\+,-\./:;<=>\?@\[\\\]\^_`\{\|\}~]+$/;
            return re.test(field);
        },
        isEmail: () => {
            let re = /\S+@\S+\.\S+/;
            return re.test(field);
        },
        isUsername: () => {
            if (field.length < 5 || field.length > 22) return false;
            let re = /^[a-zA-Z0-9-_.]+$/;
            return re.test(field);
        }
    }
}

// tests
console.log(check('!"#$%&\'()*+,-./:;<=>?@').isPassword());
console.log(check('[\]^_` {|}~').isPassword());
console.log(check('[\]^_` {|}~').isUsername());
console.log(check('spaceRanger-69_hi').isUsername());

module.exports = {
    check
};