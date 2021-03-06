const denied = require('obj-denied');
const {assign} = Object;

/**
 * Creates a new customer
 * @param {Number} name The amount to be paid
 * @param {String} email description for the payment
 * @param {String} locale Locale accepted by Mollie
 * @param {Object} metadata Metadata for your customer
 * @returns {Object} New Customer or error, created by Mollie
 */
async function create(name, email, {locale, metadata} = {}) {
    if (!name || !email) {
        throw {error: 'Not all required parameters are given'};
    }

    const data = {
        name,
        email
    };

    if (locale) {
        const allowedLocale = ['de', 'en', 'es', 'fr', 'be', 'be-fr', 'nl'];

        if (allowedLocale.indexOf(locale) === -1) {
            throw {error: `Locale has a non-allowed value.\nAllowed values: ${allowedLocale.toString()}`};
        }

        assign(data, {locale});
    }

    if (metadata) {
        assign(data, {metadata});
    }

    const result = await this.request(
        'POST',
        'customers',
        data
    );

    if (result.error) {
        throw result;
    } else {
        return result;
    }
}

/**
 * Get information about a customer from Mollie by it's id
 * @param {String} id The customers id
 * @returns {Object} Customers information or error, given by Mollie
 */
async function get(id) {
    if (!id) {
        throw {error: 'No id is given'};
    }

    const result = await this.request(
        'GET',
        `customers/${id}`
    );

    if (result.error) {
        throw result;
    } else {
        return result;
    }
}

/**
 * Retrieves a list of customers from Mollie
 * @param {Object} options Options Mollie accepts for Customers.List
 * @returns {Array} List of customers along with some other data
 */
async function list(options = {}) {
    if (!denied(options, 'count') && options.count > 250) {
        throw {error: 'Count larger than 250 is not allowed'};
    }

    const result = await this.request(
        'GET',
        'customers',
        null,
        options
    );

    if (result.error) {
        throw result;
    } else {
        return result;
    }
}

module.exports = {
    create,
    get,
    list
};
