class GetUsersService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(limit, lastKey) {
    const result = await this.userRepository.findAll(limit, lastKey);

    return result;
  }
}

module.exports = GetUsersService;
