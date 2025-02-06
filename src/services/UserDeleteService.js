class UserDeleteService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(user_id) {
    await this.userRepository.delete(user_id);
  }
}

module.exports = UserDeleteService;
