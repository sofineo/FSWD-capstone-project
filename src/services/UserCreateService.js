const { hash } = require('bcryptjs')

class UserCreateService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  //extracts fields from userData
  async execute(userData) {
    // const checkIfUserExists = await this.userRepository.findUserByEmail(email);

    // if (checkIfUserExists) {
    //   //ERROR msg
    // }

    const hashedPassword = await hash(userData.password, 8)
    userData.password = hashedPassword

    const userCreated = await this.userRepository.create(userData);

    return userCreated;
  }
}

module.exports = UserCreateService