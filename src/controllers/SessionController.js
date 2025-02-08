const SessionRepository = require("../repositories/SessionRepository");
const SessionService = require("../services/SessionService");

class SessionController {
  constructor() {
    this.sessionRepository = new SessionRepository();
    this.sessionService = new SessionService(this.sessionRepository);
  }

  async create(req, res) {
    const { email, password } = req.body;

    const { user, token } = await this.sessionService.execute({
      email,
      password,
    });

    return res.status(200).json({ user, token });
  }
}

module.exports = SessionController;
