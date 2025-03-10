import jsonwebtoken from "jsonwebtoken";
class AuthService {
    constructor() {
        // private tfLogin = dataSource.getRepository(TfLogin);
        this.verificationCodes = {}; // Store verification codes
        this.verifyToken = (access) => {
            if (access == null)
                return null;
            let user = null;
            jsonwebtoken.verify(access, process.env.SECRET_TOKEN_KEY, (err, iuser) => {
                if (err)
                    return null;
                user = iuser;
            });
            return user;
        };
    }
    storeVerificationCode(phoneNumber, code) {
        this.verificationCodes[phoneNumber] = code;
    }
    tokenUser(user) {
        const userToken = jsonwebtoken.sign({
            id: user.id,
            phoneNumber: user.phoneNumber,
        }, process.env.SECRET_TOKEN_KEY);
        return userToken;
    }
    verifyCode(phoneNumber, code) {
        return this.verificationCodes[phoneNumber] === code;
    }
    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    }
    async sendVerificationCode(phoneNumber, code) {
        // await this.twilioClient.messages.create({
        //   body: `Your verification code is: ${code}`,
        //   from: this.twilioPhoneNumber,
        //   to: phoneNumber,
        // });
    }
}
export default new AuthService();
