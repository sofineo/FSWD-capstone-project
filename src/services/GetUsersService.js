class GetUsersService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(limit, lastKey) {
    const users = await this.userRepository.findAll(limit, lastKey);

    return users;
  }
}

module.exports = GetUsersService;
