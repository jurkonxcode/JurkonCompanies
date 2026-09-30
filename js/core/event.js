
// JurkonCompanies
// Core Event System
// Version: 0.1

const GameEvents = {

    listeners: {},


    // ==========================================
    // SUBSCRIBE
    // ==========================================

    on(eventName, callback) {

        if (!this.listeners[eventName]) {

            this.listeners[eventName] = [];

        }

        this.listeners[eventName].push(callback);

    },


    // ==========================================
    // UNSUBSCRIBE
    // ==========================================

    off(eventName, callback) {

        if (!this.listeners[eventName]) {
            return;
        }

        this.listeners[eventName] =
            this.listeners[eventName].filter(
                listener => listener !== callback
            );

    },


    // ==========================================
    // EMIT EVENT
    // ==========================================

    emit(eventName, data = {}) {

        const listeners =
            this.listeners[eventName];

        if (!listeners) {
            return;
        }

        listeners.forEach(
            callback => {

                try {

                    callback(data);

                } catch (error) {

                    console.error(
                        `Error pada event: ${eventName}`,
                        error
                    );

                }

            }
        );

    },


    // ==========================================
    // CLEAR ALL
    // ==========================================

    clear() {

        this.listeners = {};

    }

};
