class UserUpdateService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(user_id, updates) {
    const updatedUser = await this.userRepository.update(user_id, updates);

    return updatedUser;
  }
}

module.exports = UserUpdateService;
