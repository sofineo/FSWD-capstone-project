class UserShowService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(user_id) {
    const user = await this.userRepository.show(user_id);

    return user;
  }
}

module.exports = UserShowService;
