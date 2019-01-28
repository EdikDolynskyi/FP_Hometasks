pubsub = {
    handlers: [],
    subscribe(event, handler, context = handler) {
        this.handlers.push({ event: event, handler: handler.bind(context) });
    },
    publish(event, args) {
        const currentHandlers = this.handlers.filter(topic => topic.event === event);
        currentHandlers.forEach(handler => handler.handler(args));
    }
};