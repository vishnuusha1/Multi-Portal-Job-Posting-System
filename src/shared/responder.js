
class Responder {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    respond(status, message, payload) {
        this.res.status(status);
        this.res.header('request-id', this.req.header('request-id'));
        this.res.json({
            message: message,
            data: payload,
        });
    }

    success(payload, message = 'OK', status = 200) {
        this.respond(status, message, payload);
    }

    error(message = 'Bad Request', payload, status = 400) {
        this.respond(status, message, payload);
    }

    unauthorized(message = 'Unauthorized', payload) {
        this.respond(401, message, payload);
    }

    forbidden(message = 'Forbidden', payload) {
        this.respond(403, message, payload);
    }

    tokenExpired(message = 'Unauthorized', payload) {
        this.respond(401, message, payload);
    }

    crash(status = 500) {
        this.respond(status, 'Internal Server Error');
    }
}

module.exports = Responder;
